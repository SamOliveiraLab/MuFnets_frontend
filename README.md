# MuFNETS GUI

### A tool used by the Oliveira Lab allowing users to create a graphical represenation of a cell-cell topology and convert it to a cell chip network visualization

## Summary

This tool includes 2 mains functions, the canvas (input) and output.

When you first use the tool, you are immediately taken to the canvas, which is where are you able to create a cell to cell topology from scratch or you are able to input one from a json file.

As you create the graph, it will be displayed on the canvas in the middle of the screen. Here you can click on the nodes and edges to select them and edit their respective settings through the right sidebar. Whenever a new node is created, it is assigned a color at random to distinguish it from the rest of the nodes. The color of the edges is determined by the source node of the edge.

![127 0 0 1_5174_ (1)](https://user-images.githubusercontent.com/44075324/224884613-6f9e15ff-7854-4e00-9fa6-ea3101ef86e0.png)

Once you are done creating the graph you can hit the compile button on the left sidebar to see the output. This app will then send the graph that you created to the Mufnets algorithm which will process the graph and output the cell network.

<img width="1779" alt="Screenshot 2023-02-28 at 4 23 23 PM" src="https://user-images.githubusercontent.com/44075324/224884328-7de1cb11-6bf0-4da3-ba3c-2e19dd14b56b.png">

## Getting Started

1. Fork this repository and download the code
2. Open the directory in your terminal
3. Run `yarn install` or `npm install` to install dependencies (both work)
4. Run `yarn run dev` or `npm run dev`
5. The test server will now be running in your browser

## Major Components

Here is a list of major components:

- Left Sidebar

  - This component has a form for creating nodes, a list of all nodes and edges currently in the app, an upload button for uploading graphs, and a compile button to see the output

- Canvas

  - This component is where the user is able to interact with nodes and edges by selecting them

- Right Sidebar

  - This component allows the user to edit the settings on the current selected node or edge

- Output
  - This page is where the output from a compiled graph will go

## Technology Used

- React + Typescript: building the UI
- React Sigma + SigmaJS + Graphology: creating the graphical representation on the canvas
- CSS + Material UI: styling components
