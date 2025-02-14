import React, { useEffect, useRef, useState } from "react";
import { Network, DataSet } from "vis-network/standalone";

const GraphConfigurator = () => {
  const networkRef = useRef(null);
  const [nodes, setNodes] = useState(new DataSet([{ id: 1, label: "Moi" }]));
  const [edges, setEdges] = useState(new DataSet([]));
  const [nodeIdCounter, setNodeIdCounter] = useState(2);
  const [selectedNode1, setSelectedNode1] = useState(null);
  const [selectedNode2, setSelectedNode2] = useState(null);

  useEffect(() => {
    const container = networkRef.current;
    const data = { nodes, edges };
    const options = {
      layout: { hierarchical: false },
      edges: { color: "black", arrows: "to" },
      nodes: { shape: "ellipse", color: "lightblue" },
    };
    new Network(container, data, options);
  }, [nodes, edges]);

  const addNode = () => {
    const newNode = { id: nodeIdCounter, label: `Noeud ${nodeIdCounter}` };
    setNodes((prevNodes) => {
      prevNodes.add(newNode);
      return prevNodes;
    });
    setNodeIdCounter(nodeIdCounter + 1);
  };

  const addEdge = () => {
    if (selectedNode1 && selectedNode2 && selectedNode1 !== selectedNode2) {
      const newEdges = [
        { from: selectedNode1, to: selectedNode2 },
        { from: selectedNode2, to: selectedNode1 },
      ];
      setEdges((prevEdges) => {
        prevEdges.add(newEdges);
        return prevEdges;
      });
    }
  };

  return (
    <div>
      <h1>Configurateur de Graphe</h1>
      <button onClick={addNode}>Ajouter un Noeud</button>
      <br /><br />
      <label>Connecter : </label>
      <select onChange={(e) => setSelectedNode1(parseInt(e.target.value))}>
        <option value="">Sélectionner un nœud</option>
        {nodes.map((node) => (
          <option key={node.id} value={node.id}>{node.label}</option>
        ))}
      </select>
      <select onChange={(e) => setSelectedNode2(parseInt(e.target.value))}>
        <option value="">Sélectionner un nœud</option>
        {nodes.map((node) => (
          <option key={node.id} value={node.id}>{node.label}</option>
        ))}
      </select>
      <button onClick={addEdge}>Créer un Lien Bidirectionnel</button>
      <div ref={networkRef} style={{ width: "700px", height: "500px", border: "1px solid black" }} />
    </div>
  );
};

export default GraphConfigurator;
