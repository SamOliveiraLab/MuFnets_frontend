import CompileButton from './CompileButton';
import UploadButton from './UploadButton';
import EdgesList from './EdgesList';
import NodesList from './NodesList';
import CreateNodeForm from './CreateNodeForm';
import './LeftSidebar.css';
import DownloadButton from './DownloadButton';

const LeftSidebar = () => {
  return (
    <div className="leftsidebar-container">
      <CreateNodeForm />
      <div className="node-and-edge-list">
        <NodesList />
        <EdgesList />
      </div>
      <div className="buttons-container">
        <UploadButton />
        <CompileButton />
        <DownloadButton />
      </div>
    </div>
  );
};

export default LeftSidebar;
