import CompileButton from './CompileButton';
import UploadButton from './UploadButton';
import EdgesList from './EdgesList';
import NodesList from './NodesList';
import CreateNodeForm from './CreateNodeForm';
import CanvasDownloadButton from './CanvasDownloadButton';
import './LeftSidebar.css';

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
        <CanvasDownloadButton />
      </div>
    </div>
  );
};

export default LeftSidebar;
