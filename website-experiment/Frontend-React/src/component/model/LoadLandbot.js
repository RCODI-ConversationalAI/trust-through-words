import React, { useRef, useEffect } from "react";
/*global Landbot*/
export default function LoadLandbot({ url, experimentId, userData }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const _landbot = new Landbot.Container({
      container: containerRef.current,
      configUrl: url,
      customData: {
        experimentId: experimentId,
        groupId: userData.Group,
      },
    });

    return () => _landbot.destroy();
    // eslint-disable-next-line
  }, [url, containerRef]);

  return <div className="landbot" ref={containerRef} />;
}
