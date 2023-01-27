import React, { useEffect, useRef, useState } from 'react';
import MazeBlock from '../class/MazeBlock';
type direction = 'top'|'left'|'right'|'bottom';
const DIRECTION : direction[] = ['top', 'left', 'right', 'bottom']

//note for [number, direction] tuple, symbolize = [current route , from which direction]

function UseSolve(blocks : MazeBlock[], setBlocks : React.Dispatch<React.SetStateAction<MazeBlock[]>>,finish: number, start: number, col: number, row: number){
    let visited = useRef<boolean[]>([]);
    let routeRef = useRef<[number, direction][]>([]);
    let [route, setRoute] = useState<[number, direction][]>([]);
    let flag = useRef(false);

    const getCandidate = (index : number)=>{
      let candidate : [number, direction][] = [];
      DIRECTION.forEach(direct=>{
        let adjacentBlock = getAdjacentBlock(index, direct)
        if(blocks[index][direct] && adjacentBlock && !visited.current[adjacentBlock])
          candidate.push([adjacentBlock, direct]);
      })
      return candidate;
    }

    const solver = ()=>{
        flag.current = false;
        routeRef.current = [];
        visited.current = Array(col*row).fill(false);
        solve(start);
        setRoute(routeRef.current);
    }

    useEffect(()=>{
        route.forEach((route)=>console.log('current route : ', route[0], 'from : ', route[1]));
    }, [route])

    const solve = (index : number)=>{
      const candidates = getCandidate(index);

      visited.current[index] = true;

      if(index === finish || flag.current){
        flag.current = true;
        return
      }

      candidates.forEach((candidate)=>{
        if(flag.current)
            return
            
        routeRef.current.push(candidate);
        solve(candidate[0]);

        if(flag.current)
            return
        
        routeRef.current.pop();
      })

      if(flag.current)
        return
      visited.current[index] = false;
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

    const clearRoute = ()=>{
        setRoute([]);
    }
    return {solver, setBlock, route, clearRoute};
}

export default UseSolve;