import React, { useEffect, useRef, useState } from "react";
import { Network, DataSet } from "vis-network/standalone";

const GraphConfigurator = () => {
  const networkRef = useRef(null);
  const nodes = useRef(new DataSet([{ id: 1, label: "Moi", group: "default" }]));
  const edges = useRef(new DataSet([]));
  const [nodeIdCounter, setNodeIdCounter] = useState(2);
  const [nodeLabel, setNodeLabel] = useState("");
  const [groupLabel, setGroupLabel] = useState("");
  const [selectedNode1, setSelectedNode1] = useState(null);
  const [selectedNode2, setSelectedNode2] = useState(null);
  const [selectedGroupForNode, setSelectedGroupForNode] = useState("");
  const [selectedGroupForEdge, setSelectedGroupForEdge] = useState("");
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const container = networkRef.current;
    const data = { nodes: nodes.current, edges: edges.current };
    const options = {
      layout: {
        improvedLayout: true,
        physics: {
          enabled: true,
          barnesHut: {
            gravitationalConstant: -3000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 1
          }
        }
      },
      edges: {
        color: "black",
        arrows: "none",
        smooth: {
          type: "dynamic"
        },
        width: 1.5
      },
      nodes: {
        shape: "ellipse",
        size: 25,
        font: {
          size: 18,
          color: "black"
        },
        color: {
          background: "yellow",
          border: "black"
        },
        borderWidth: 2
      }
    };
    new Network(container, data, options);
  }, []);

  const addNode = () => {
    if (!nodeLabel.trim()) {
      console.warn("Le nom du nœud ne peut pas être vide !");
      return;
    }
    const newId = nodeIdCounter;
    nodes.current.add({ id: newId, label: nodeLabel, group: selectedGroupForNode || "default" });
    setNodeIdCounter(nodeIdCounter + 1);
    setNodeLabel("");

    if (selectedGroupForNode) {
      nodes.current.get().forEach(node => {
        if (node.group === selectedGroupForNode && node.id !== newId) {
          edges.current.add([{ from: newId, to: node.id }]);
        }
      });
    }
  };

  const addGroup = () => {
    if (!groupLabel.trim() || groups.includes(groupLabel)) return;
    setGroups([...groups, groupLabel]);
    setGroupLabel("");
  };

  const addEdge = (dashed = false) => {
    if (!selectedNode1) return;
    if (selectedNode2) {
      if (selectedNode1 === selectedNode2) return;
      if (edges.current.get().some(edge => (edge.from === selectedNode1 && edge.to === selectedNode2) || (edge.from === selectedNode2 && edge.to === selectedNode1))) return;
      edges.current.add([{ from: selectedNode1, to: selectedNode2, dashes: dashed }]);
    } else if (selectedGroupForEdge) {
      nodes.current.get().forEach(node => {
        if (node.group === selectedGroupForEdge && node.id !== selectedNode1) {
          edges.current.add([{ from: selectedNode1, to: node.id, dashes: dashed }]);
        }
      });
    }
  };

  return (
    <div>
      <h1>Configurateur de Graphe</h1>
      <input type="text" value={nodeLabel} onChange={(e) => setNodeLabel(e.target.value)} placeholder="Nom du nœud" />
      <select onChange={(e) => setSelectedGroupForNode(e.target.value)}>
        <option value="">Sélectionner un groupe</option>
        {groups.map((group, index) => (
          <option key={index} value={group}>{group}</option>
        ))}
      </select>
      <button onClick={addNode}>Ajouter un Noeud</button>
      <br /><br />
      <input type="text" value={groupLabel} onChange={(e) => setGroupLabel(e.target.value)} placeholder="Nom du groupe" />
      <button onClick={addGroup}>Ajouter un Groupe</button>
      <br /><br />
      <label>Connecter : </label>
      <select onChange={(e) => setSelectedNode1(parseInt(e.target.value))}>
        <option value="">Sélectionner un nœud</option>
        {nodes.current.get().map((node) => (
          <option key={node.id} value={node.id}>{node.label}</option>
        ))}
      </select>
      <select onChange={(e) => setSelectedNode2(parseInt(e.target.value))}>
        <option value="">Sélectionner un nœud</option>
        {nodes.current.get().map((node) => (
          <option key={node.id} value={node.id}>{node.label}</option>
        ))}
      </select>
      <select onChange={(e) => setSelectedGroupForEdge(e.target.value)}>
        <option value="">Ou connecter à un groupe</option>
        {groups.map((group, index) => (
          <option key={index} value={group}>{group}</option>
        ))}
      </select>
      <button onClick={() => addEdge(false)}>Créer un Lien</button>
      <button onClick={() => addEdge(true)}>Créer un Lien Faible</button>
      <div ref={networkRef} style={{ width: "900px", height: "600px", border: "1px solid black" }} />
    </div>
  );
};

export default GraphConfigurator;
