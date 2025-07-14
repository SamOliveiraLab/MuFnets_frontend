import OutputDownloadButton from "../components/OutputPageComponents/OutputDownloadButton";
import OutputDisplay from "../components/OutputPageComponents/OutputDisplay/VictoryOutputDisplay";
import { createRef, useContext } from "react";
import VictoryOutputDisplay from "../components/OutputPageComponents/OutputDisplay/VictoryOutputDisplay";
import D3GraphWithImages from "../components/OutputPageComponents/OutputDisplay/D3Output";
import { SelectedTypeContext } from "../App";

const OuputPage = () => {
  const screenshotRef = createRef();

  const { selectedType }: any = useContext(SelectedTypeContext);

  switch (selectedType) {
    case "milifluidics":
      return (
        <>
          <D3GraphWithImages />
          <OutputDownloadButton screenshotRef={screenshotRef} />
        </>
      );
    // case "hybrid":
    //   return <VictoryOutputDisplay />;
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
