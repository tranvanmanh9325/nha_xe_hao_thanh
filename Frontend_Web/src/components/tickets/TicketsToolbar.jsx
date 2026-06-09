import { DownloadIcon } from '../../assets/icons';

const TicketsToolbar = () => {
  return (
    <div className="tickets-toolbar">
      <h1 className="tickets-toolbar__title">Quản lý vé</h1>
      <div className="tickets-toolbar__actions">
        <button className="btn btn--outline" type="button">
          <DownloadIcon size={16} />
          Xuất Excel
        </button>
      </div>
    </div>
  );
};

export default TicketsToolbar;
