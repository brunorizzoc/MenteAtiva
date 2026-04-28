
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, ModuleId, SessionRecord } from './constants';

interface AppStore extends GameState {
  setPlayer: (nome: string) => void;
  addPoints: (moduleId: string, points: number, errors?: number) => void;
  updateGlobalProgression: () => void;
  setModuleLevel: (moduleId: string, level: number) => void;
  toggleTheme: () => void;
  resetStore: () => void;
  importStore: (data: any) => boolean;
}

const APP_VALIDATION_KEY = 'MENTE_ATIVA_V1_VALID';

const initialModuleProgress = {
  nivel: 1,
  pontos: 0,
  totalJogadas: 0,
  ultimoScore: 0,
  erros: 0,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      jogador: null,
      nivelGlobal: 1,
      pontosTotal: 0,
      diasConsecutivos: 1,
      modulos: {
        [ModuleId.TOQUE_LUZ]: { ...initialModuleProgress },
        [ModuleId.COR_IGUAL]: { ...initialModuleProgress },
        [ModuleId.MEMORIA_FOTOS]: { ...initialModuleProgress },
        [ModuleId.CAIXA_SEPARACAO]: { ...initialModuleProgress },
        [ModuleId.SEQUENCIA_LOGICA]: { ...initialModuleProgress },
        [ModuleId.MATEMATICA_FACIL]: { ...initialModuleProgress },
        [ModuleId.BUSCA_VISUAL]: { ...initialModuleProgress },
        [ModuleId.STROOP_TEST]: { ...initialModuleProgress },
      },
      historico: [],
      configuracoes: {
        tema: 'claro',
        vibracao: true,
        tamanhoFonte: 'normal',
      },

      setPlayer: (nome) => set({ 
        jogador: { 
          nome, 
          dataCriacao: new Date().toISOString(), 
          ultimoLogin: new Date().toISOString() 
        } 
      }),

      addPoints: (moduleId, points, errors = 0) => set((state) => {
        const mod = state.modulos[moduleId];
        const newPoints = mod.pontos + points;
        const newErros = (mod.erros || 0) + errors;
        
        const updatedModulos = {
          ...state.modulos,
          [moduleId]: {
            ...mod,
            pontos: newPoints,
            erros: newErros,
            totalJogadas: mod.totalJogadas + 1,
            ultimoScore: points,
          }
        };

        const newSession: SessionRecord = {
          timestamp: new Date().toISOString(),
          moduleId,
          points,
          errors
        };

        return { 
          modulos: updatedModulos,
          historico: [...state.historico, newSession].slice(-50)
        };
      }),

      updateGlobalProgression: () => set((state) => {
        const totalPoints = Object.values(state.modulos).reduce((acc, m) => acc + m.pontos, 0);
        const sequenceBonus = Math.min(state.diasConsecutivos * 100, 1000);
        const newGlobalNivel = Math.floor(Math.sqrt((totalPoints + sequenceBonus) / 500)) + 1;
        
        return { 
          pontosTotal: totalPoints,
          nivelGlobal: newGlobalNivel 
        };
      }),

      setModuleLevel: (moduleId, level) => set((state) => ({
        modulos: {
          ...state.modulos,
          [moduleId]: {
            ...state.modulos[moduleId],
            nivel: level
          }
        }
      })),

      toggleTheme: () => set((state) => {
        const newTheme = state.configuracoes.tema === 'claro' ? 'escuro' : 'claro';
        document.documentElement.setAttribute('data-theme', newTheme);
        return {
          configuracoes: {
            ...state.configuracoes,
            tema: newTheme
          }
        };
      }),

      resetStore: () => {
        localStorage.clear();
        window.location.reload();
      },

      importStore: (data) => {
        if (data && data.validationKey === APP_VALIDATION_KEY) {
          const { validationKey, exportDate, ...storeData } = data;
          set(storeData);
          document.documentElement.setAttribute('data-theme', storeData.configuracoes.tema);
          return true;
        }
        return false;
      }
    }),
    {
      name: 'mente-ativa-v1',
      version: 3,
      migrate: (persistedState: any, version: number) => {
        if (version < 3) {
          const newState = { ...(persistedState as any) };
          newState.modulos = { ...newState.modulos };
          
          // Ensure all expected modules exist
          const allModules = [
            ModuleId.TOQUE_LUZ,
            ModuleId.COR_IGUAL,
            ModuleId.MEMORIA_FOTOS,
            ModuleId.CAIXA_SEPARACAO,
            ModuleId.SEQUENCIA_LOGICA,
            ModuleId.MATEMATICA_FACIL,
            ModuleId.BUSCA_VISUAL,
            ModuleId.STROOP_TEST
          ];

          allModules.forEach(id => {
            if (!newState.modulos[id]) {
              newState.modulos[id] = {
                nivel: 1,
                pontos: 0,
                totalJogadas: 0,
                ultimoScore: 0,
                erros: 0,
              };
            }
          });
          return newState;
        }
        return persistedState;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.setAttribute('data-theme', state.configuracoes.tema);
        }
      }
    }
  )
);

export const exportStoreData = (state: any) => {
  const data = {
    ...state,
    validationKey: APP_VALIDATION_KEY,
    exportDate: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const patientName = state.jogador?.nome || 'aluno';
  a.download = `mente-ativa-${patientName.toLowerCase().replace(/\s+/g, '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
