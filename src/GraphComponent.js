import React, { useEffect, useRef } from "react";
import { Network, DataSet } from "vis-network/standalone"; // ✅ Import correct

const GraphComponent = () => {
  const networkRef = useRef(null);

  useEffect(() => {
    const container = networkRef.current;

    // ✅ Utilisation de DataSet pour nodes et edges
    const nodes = new DataSet([
      { id: 1, label: "Moi" },
      { id: 2, label: "Personne 1" },
      { id: 3, label: "Personne 2" },
      { id: 4, label: "Personne 3" },
      { id: 5, label: "Personne 4" },
    ]);

    const edges = new DataSet([
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 1, to: 5 },
    ]);

    const data = { nodes, edges };
    const options = {
      layout: { hierarchical: false },
      edges: { color: "black" },
    };

    new Network(container, data, options);
  }, []);

  return <div ref={networkRef} style={{ width: "600px", height: "400px", border: "1px solid black" }} />;
};

export default GraphComponent;
