import { PlusIcon, DownloadIcon } from '../../assets/icons';

const TripsToolbar = ({ onAddClick }) => {
  return (
    <div className="trips-toolbar">
      <h1 className="trips-toolbar__title">Quản lý chuyến xe</h1>
      <div className="trips-toolbar__actions">
        <button className="btn btn--outline" type="button">
          <DownloadIcon size={16} />
          Xuất Excel
        </button>
        <button className="btn btn--primary" type="button" onClick={onAddClick}>
          <PlusIcon size={16} />
          Thêm chuyến xe mới
        </button>
      </div>
    </div>
  );
};

export default TripsToolbar;
