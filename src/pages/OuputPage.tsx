import OutputDownloadButton from '../components/OutputPageComponents/OutputDownloadButton';
import OutputDisplay from '../components/OutputPageComponents/OutputDisplay/OutputDisplay';
import { createRef } from 'react';
import VictoryOutputDisplay from '../components/OutputPageComponents/OutputDisplay/VictoryOutputDisplay';

const OuputPage = () => {
  const screenshotRef = createRef();

  return (
    <div>
      {/* <OutputDisplay screenshotRef={screenshotRef} /> */}
      <VictoryOutputDisplay />
      <OutputDownloadButton screenshotRef={screenshotRef} />
    </div>
  );
};

export default OuputPage;
