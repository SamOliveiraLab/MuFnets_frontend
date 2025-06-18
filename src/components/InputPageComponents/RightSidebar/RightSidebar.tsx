import { useContext, useState } from "react";
import {
  SelectedNodeContext,
  SelectedEdgeContext,
} from "../../../pages/HomePage";
import { Typography } from "@mui/material";
import NodeInformation from "./NodeInformation";
import EdgeList from "./EdgeList";
import DeleteNode from "./DeleteNode";
import EdgeInformation from "./EdgeInformation";
import "./RightSidebar.css";
import UploadNodeJson from "./uploadNodeJson";



/* 
  Right Sidebar
    This sidebar is used primarily to view and update the settings of the nodes and edges
*/

const RightSidebar = () => {
  const { selectedNode }: any = useContext(SelectedNodeContext);
  const { selectedEdge }: any = useContext(SelectedEdgeContext);

  return (
    <div className="rightsidebar-container">
      <div className="node-settings">
        
        <UploadNodeJson />
      
        {selectedNode != "" ? (
          <div style={{paddingTop: 10, paddingLeft: 10}}>
            <Typography>Selected Node: {selectedNode}</Typography>
            <NodeInformation />
            <EdgeList />
            <DeleteNode />
          </div>
        ) : null}
      </div>
      <div className="edge-settings">
        {selectedEdge?.length > 0 ? (
          <div>
            <EdgeInformation />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RightSidebar;
