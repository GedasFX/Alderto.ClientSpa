import { FiChevronRight } from 'react-icons/fi';

export default function Breadcrumb() {
  return null;

  return (
    <div className="-intro-x mr-auto breadcrumb hidden sm:flex">
      <a href="">Application</a>
      <FiChevronRight className="breadcrumb__icon" />
      <a href="" className="breadcrumb--active">
        Dashboard
      </a>
    </div>
  );
}
