import {
  Activity,
  Orbit,
  Satellite,
} from 'lucide-react';

interface HeaderProps {
  activeSection?: string;
}

function Header({
  activeSection = 'Overview',
}: HeaderProps) {
  const navigation = [
    'Overview',
    'Model',
    'Simulation',
  ];

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand__icon">
          <Orbit size={20} strokeWidth={1.7} />
        </div>

        <div>
          <div className="brand__name">
            ORBITAL SIGNAL LAB
          </div>

          <div className="brand__subtitle">
            Differential Equation Mission Control
          </div>
        </div>
      </div>

      <nav className="topbar__navigation">
        {navigation.map((item) => (
          <button
            type="button"
            key={item}
            className={
              activeSection === item
                ? 'topbar__navigation-item topbar__navigation-item--active'
                : 'topbar__navigation-item'
            }
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="system-status">
        <div className="system-status__signal">
          <Activity size={14} />
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
          size={19}
          strokeWidth={1.5}
        />
      </div>
    </header>
  );
}

export default Header;