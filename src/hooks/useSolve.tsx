import React, { useEffect, useRef, useState } from 'react';
import MazeBlock from '../class/MazeBlock';
type direction = 'top'|'right'|'bottom'|'left';
const DIRECTION : direction[] = ['top', 'right', 'bottom', 'left']

//note for [number, direction] tuple, symbolize = [current route , from which direction]
//TODO: fix when index 0 cannot become candidate

function useSolve(blocks : MazeBlock[], setBlocks : React.Dispatch<React.SetStateAction<MazeBlock[]>>,finish: number, start: number, col: number, row: number, maxRoute : number = 1){
    let visited = useRef<boolean[]>([]);
    let routeRef = useRef<[number, direction][]>([]);
    let routesRef = useRef<[number, direction][][]>([]);
    let [routes, setRoutes] = useState<[number, direction][][]>([]); // array of route
    let flag = useRef(false);

    const clearRoutes = ()=>{
        routesRef.current = [];
        routeRef.current = [];
        setRoutes([]);
    }

    const getAdjacentBlock = (index : number, direction : 'left' | 'right' | 'bottom' | 'top') : null | number =>{
      let adjacentIndex = null;
      switch(direction){
        case 'left':
          if(index % col !== 0){
            adjacentIndex = index - 1;
          }
          break;
        case 'right':
          if(index % col !== col - 1){
            adjacentIndex = index + 1;
          }
          break;
        case 'top':
          if(index >= col){
            adjacentIndex = index - col;
          }
          break;
        case 'bottom':
          if(index < col * row - col){
            adjacentIndex = index + col;
          }
          break;
      }
      return adjacentIndex;
    }

    const setBlock = (index : number, direction : 'left' | 'right' | 'bottom' | 'top')=>{
      let newBlocks = [...blocks];
      let adjacentBlock = getAdjacentBlock(index, direction);

      newBlocks[index][direction] = !newBlocks[index][direction];
      if(adjacentBlock !== null)
        newBlocks[adjacentBlock][direction === 'left' ? 'right' : direction === 'right' ? 'left' : direction === 'top' ? 'bottom' : 'top'] = !newBlocks[adjacentBlock][direction === 'left' ? 'right' : direction === 'right' ? 'left' : direction === 'top' ? 'bottom' : 'top'];
      setBlocks(newBlocks);
    } 

    const getCandidate = (index : number)=>{
      let candidate : [number, direction][] = [];
      DIRECTION.forEach(direct=>{
        let adjacentBlock = getAdjacentBlock(index, direct)
        if(blocks[index][direct] && adjacentBlock !== null && !visited.current[adjacentBlock])
          candidate.push([adjacentBlock, direct]);
      })
      return candidate;
    }

    const solver = ()=>{
        flag.current = false;
        routeRef.current = [];
        routesRef.current = [];
        visited.current = Array(col*row).fill(false);
        solve(start);
        setRoutes(routesRef.current.sort((a,b)=>a.length - b.length));
    }

    const solve = (index : number)=>{
      const candidates = getCandidate(index).reverse();

      visited.current[index] = true;

      if(index === finish){
        routesRef.current.push([...routeRef.current]);
        if(routesRef.current.length === maxRoute)
          flag.current = true;
      }

      if(flag.current)
        return

      while(candidates.length > 0 && !flag.current){
        let candidate = candidates.pop()!;
        routeRef.current.push(candidate);
        solve(candidate[0]);

        routeRef.current.pop();
      }

      visited.current[index] = false;
    }

    return {solver, setBlock, routes, clearRoutes};
}

export default useSolve