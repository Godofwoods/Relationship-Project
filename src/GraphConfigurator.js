import React, { useEffect, useRef, useState } from "react";
import { Network, DataSet } from "vis-network/standalone";

const GraphConfigurator = () => {
  const networkRef = useRef(null);
  const [nodes] = useState(new DataSet([{ id: 1, label: "Moi" }]));
  const [edges] = useState(new DataSet([]));
  const [nodeIdCounter, setNodeIdCounter] = useState(2);
  const [nodeLabel, setNodeLabel] = useState("");
  const [selectedNode1, setSelectedNode1] = useState(null);
  const [selectedNode2, setSelectedNode2] = useState(null);

  useEffect(() => {
    const container = networkRef.current;
    const data = { nodes, edges };
    const options = {
      layout: { hierarchical: false },
      edges: { color: "black", arrows: "none", smooth: { type: "curvedCW", roundness: 0.2 } },
      nodes: { shape: "ellipse", color: "lightblue" },
    };
    new Network(container, data, options);
  }, [nodes, edges]);

  const addNode = () => {
    if (!nodeLabel.trim()) {
      console.warn("Le nom du nœud ne peut pas être vide !");
      return;
    }
    const newId = nodeIdCounter;
    nodes.add({ id: newId, label: nodeLabel });
    setNodeIdCounter(nodeIdCounter + 1);
    setNodeLabel("");
  };

  const removeNode = () => {
    if (!selectedNode1) {
      console.warn("Sélectionnez un nœud à supprimer.");
      return;
    }
    nodes.remove(selectedNode1);
    edges.remove(edges.get().filter(edge => edge.from === selectedNode1 || edge.to === selectedNode1));
    setSelectedNode1(null);
  };

  const addEdge = () => {
    if (!selectedNode1 || !selectedNode2 || selectedNode1 === selectedNode2) {
      console.warn("Sélectionnez deux nœuds différents pour les connecter.");
      return;
    }
    
    const existingEdges = edges.get();
    const edgeExists = existingEdges.some(
      (edge) => (edge.from === selectedNode1 && edge.to === selectedNode2) || (edge.from === selectedNode2 && edge.to === selectedNode1)
    );

    if (edgeExists) {
      console.warn("Ce lien existe déjà !");
      return;
    }
    
    edges.add([{ from: selectedNode1, to: selectedNode2 }]);
  };

  const removeEdge = () => {
    if (!selectedNode1 || !selectedNode2) {
      console.warn("Sélectionnez deux nœuds pour supprimer un lien.");
      return;
    }
    edges.remove(edges.get().filter(edge => (edge.from === selectedNode1 && edge.to === selectedNode2) || (edge.from === selectedNode2 && edge.to === selectedNode1)));
  };

  return (
    <div>
      <h1>Configurateur de Graphe</h1>
      <input type="text" value={nodeLabel} onChange={(e) => setNodeLabel(e.target.value)} placeholder="Nom du nœud" />
      <button onClick={addNode}>Ajouter un Noeud</button>
      <button onClick={removeNode}>Supprimer un Noeud</button>
      <br /><br />
      <label>Connecter : </label>
      <select onChange={(e) => setSelectedNode1(parseInt(e.target.value))}>
        <option value="">Sélectionner un nœud</option>
        {nodes.get().map((node) => (
          <option key={node.id} value={node.id}>{node.label}</option>
        ))}
      </select>
      <select onChange={(e) => setSelectedNode2(parseInt(e.target.value))}>
        <option value="">Sélectionner un nœud</option>
        {nodes.get().map((node) => (
          <option key={node.id} value={node.id}>{node.label}</option>
        ))}
      </select>
      <button onClick={addEdge}>Créer un Lien</button>
      <button onClick={removeEdge}>Supprimer un Lien</button>
      <div ref={networkRef} style={{ width: "700px", height: "500px", border: "1px solid black" }} />
    </div>
  );
};

export default GraphConfigurator;
