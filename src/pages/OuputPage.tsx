import OutputDownloadButton from "../components/OutputPageComponents/OutputDownloadButton";
import OutputDisplay from "../components/OutputPageComponents/OutputDisplay/VictoryOutputDisplay";
import { createRef, useContext } from "react";
import VictoryOutputDisplay from "../components/OutputPageComponents/OutputDisplay/VictoryOutputDisplay";
import D3GraphWithImages from "../components/OutputPageComponents/OutputDisplay/D3MiliOutput";
import { SelectedTypeContext } from "../App";
import D3HybridOutput from "../components/OutputPageComponents/OutputDisplay/D3hybridOutput";

const OuputPage = () => {
  const screenshotRef = createRef();

  const { selectedType }: any = useContext(SelectedTypeContext);

  <h1> {selectedType} Network</h1>
  switch (selectedType) {
    case "milifluidics":
      return (
        <>
          <D3GraphWithImages />
          <OutputDownloadButton screenshotRef={screenshotRef} />
        </>
      );
    case "hybrid":
      return <D3HybridOutput />;
    case "monolayer":
      return (
        <>
          <VictoryOutputDisplay />
          <OutputDownloadButton screenshotRef={screenshotRef} />
        </>
      );
    default:
      return null;
  }
};

export default OuputPage;
