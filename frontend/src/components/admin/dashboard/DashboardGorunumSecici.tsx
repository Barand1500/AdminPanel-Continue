import {
  DASHBOARD_GORUNUM_ETIKETLERI,
  type DashboardGorunum,
} from '@/utils/dashboardGorunum';

export function DashboardGorunumSecici({
  aktif,
  onDegistir,
}: {
  aktif: DashboardGorunum;
  onDegistir: (gorunum: DashboardGorunum) => void;
}) {
  return (
    <div className="ap-dash-gorunum" role="tablist" aria-label="Dashboard görünümü">
      {DASHBOARD_GORUNUM_ETIKETLERI.map((g) => (
        <button
          key={g.id}
          type="button"
          role="tab"
          aria-selected={aktif === g.id}
          title={g.aciklama}
          className={aktif === g.id ? 'ap-dash-gorunum-aktif' : ''}
          onClick={() => onDegistir(g.id)}
        >
          {g.etiket}
        </button>
      ))}
    </div>
  );
}
