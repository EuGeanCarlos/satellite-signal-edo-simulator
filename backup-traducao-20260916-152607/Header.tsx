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
  activeSection: AppSection;

  theme: ThemeMode;

  onSectionChange: (
    section: AppSection,
  ) => void;

  onToggleTheme: () => void;
}

function Header({
  activeSection,
  theme,
  onSectionChange,
  onToggleTheme,
}: HeaderProps) {
  const navigation: AppSection[] = [
    'Overview',
    'Model',
    'Simulation',
  ];

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
            Differential Equation
            Mission Control
          </div>
        </div>
      </div>

      <nav
        className="topbar__navigation"
        aria-label="Main navigation"
      >
        {navigation.map(
          (item) => {
            const isActive =
              activeSection === item;

            const isDisabled =
              item === 'Simulation';

            return (
              <button
                type="button"
                key={item}
                disabled={isDisabled}
                title={
                  isDisabled
                    ? 'Simulation workspace will be added next'
                    : undefined
                }
                className={
                  isActive
                    ? 'topbar__navigation-item topbar__navigation-item--active'
                    : 'topbar__navigation-item'
                }
                onClick={() => {
                  if (!isDisabled) {
                    onSectionChange(
                      item,
                    );
                  }
                }}
              >
                {item}
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
              SYSTEM
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
          onClick={onToggleTheme}
          title={
            theme === 'dark'
              ? 'Switch to light theme'
              : 'Switch to dark theme'
          }
          aria-label="Toggle color theme"
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