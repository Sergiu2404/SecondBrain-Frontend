import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchNodesAPI,
  createNodeAPI,
  deleteNodeAPI,
  getRecursiveChildIds,
} from "../../data/services/file-system/FileSystemService";

export const fetchNodes = createAsyncThunk(
  "fileSystem/fetchNodes",
  async () => {
    return await fetchNodesAPI();
  }
);

export const createNode = createAsyncThunk(
  "fileSystem/createNode",
  async (nodeData) => {
    return await createNodeAPI(nodeData);
  }
);

export const deleteNode = createAsyncThunk(
  "fileSystem/deleteNode",
  async (nodeId) => {
    return await deleteNodeAPI(nodeId);
  }
);

const fileSystemSlice = createSlice({
  name: "fileSystem",
  initialState: {
    nodes: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNodes.fulfilled, (state, action) => {
        state.nodes = action.payload;
        state.status = "idle";
      })
      .addCase(createNode.fulfilled, (state, action) => {
        if (action.payload) {
          state.nodes = [...state.nodes, action.payload];
        }
      })
      .addCase(deleteNode.fulfilled, (state, action) => {
        const targetId = action.payload;
        console.log("idToDelete: ", targetId)


        // find all children of node to delete
        const idsToRemove = [
          targetId,
          ...getRecursiveChildIds(targetId, state.nodes),
        ];

        // filter out deleted node and its children
        state.nodes = state.nodes.filter(
          (node) => !idsToRemove.includes(node.id)
        );

        state.status = "idle";
      });
  },
});

export default fileSystemSlice.reducer;
