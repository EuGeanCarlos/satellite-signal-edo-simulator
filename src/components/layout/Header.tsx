import {
  Activity,
  Moon,
  Orbit,
  Satellite,
  Sun,
} from 'lucide-react';

export type AppSection =
  | 'Overview'
  | 'Model'
  | 'Simulation';

type ThemeMode =
  | 'dark'
  | 'light';

interface HeaderProps {
  activeSection:
    AppSection;

  theme:
    ThemeMode;

  onSectionChange: (
    section:
      AppSection,
  ) => void;

  onToggleTheme:
    () => void;
}

const navigation: {
  value:
    AppSection;

  label:
    string;
}[] = [
  {
    value:
      'Overview',

    label:
      'VISÃO GERAL',
  },

  {
    value:
      'Model',

    label:
      'MODELO',
  },

  {
    value:
      'Simulation',

    label:
      'SIMULAÇÃO',
  },
];

function Header({
  activeSection,
  theme,
  onSectionChange,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand__icon">
          <Orbit
            size={19}
            strokeWidth={1.7}
          />
        </div>

        <div>
          <div className="brand__name">
            ORBITAL

            <span>
              SIGNAL LAB
            </span>
          </div>

          <div className="brand__subtitle">
            Controle de Missão com
            Equações Diferenciais
          </div>
        </div>
      </div>

      <nav
        className="topbar__navigation"
        aria-label="Navegação principal"
      >
        {navigation.map(
          ({
            value,
            label,
          }) => {
            const isActive =
              activeSection ===
              value;

            return (
              <button
                type="button"
                key={value}
                className={
                  isActive
                    ? 'topbar__navigation-item topbar__navigation-item--active'
                    : 'topbar__navigation-item'
                }
                onClick={() =>
                  onSectionChange(
                    value,
                  )
                }
              >
                {label}
              </button>
            );
          },
        )}
      </nav>

      <div className="topbar__actions">
        <div className="system-status">
          <div className="system-status__signal">
            <Activity
              size={14}
            />
          </div>

          <div>
            <span className="system-status__label">
              SISTEMA
            </span>

            <span className="system-status__value">
              ONLINE
            </span>
          </div>

          <Satellite
            className="system-status__satellite"
            size={17}
            strokeWidth={1.5}
          />
        </div>

        <button
          type="button"
          className="topbar__icon-button"
          onClick={
            onToggleTheme
          }
          title={
            theme === 'dark'
              ? 'Alternar para tema claro'
              : 'Alternar para tema escuro'
          }
          aria-label="Alternar tema de cores"
        >
          {theme === 'dark'
            ? (
              <Sun
                size={16}
              />
            )
            : (
              <Moon
                size={16}
              />
            )}
        </button>
      </div>
    </header>
  );
}

export default Header;