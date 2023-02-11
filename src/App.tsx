import React, { useEffect, useRef, useState } from 'react';
import MazeBlock from './class/MazeBlock';
import useSolve from './hooks/useSolve';

function App() {
  let [blocks, setBlocks] = useState<MazeBlock[]>([]);
  let [start, setStart] = useState(0);
  let [finish, setFinish] = useState(0);
  let [col, setCol] = useState(5);
  let [row, setRow] = useState(5);
  let [selected, setSelected] = useState<number | null>(null);
  let [maxRoute, setMaxRoute] = useState(1);
  let {solver, setBlock, routes, clearRoutes} = useSolve(blocks, setBlocks, finish, start, col, row, maxRoute);

  //clear maze and init maze
  const clear = ()=>{
    setSelected(null);
    setBlocks(Array(col*row).fill(0).map((_, index)=>new MazeBlock()));
    setFinish(col*row-1);
    setStart(0);
    clearRoutes();
  }

  useEffect(()=>{
    if(routes.length > 0) setSelected(0);
    else setSelected(null);
  }, [routes])


  useEffect(()=>{
    clear();
  }, [col, row])

  return (
    <div className="App flex flex-col w-max">
      <div className='relative'>
        { selected !== null &&
        <div className='top-1 relative'>
          {routes[selected].map((route, index)=>{
            return <div key={index} className='absolute w-10 h-10 z-[1] pointer-events-none' style={{transform: `translate(${(route[0]%col)*48.5}px, ${(Math.floor(route[0]/col))*48.5}px)`}}>
              <div className='relative w-full h-full'>
                {route[1] === 'top' && <div className='absolute transform -translate-x-1/2 right-1/2 -bottom-2/3 w-1 h-[120%] bg-yellow-500'></div>}
                {route[1] === 'left' && <div className='absolute transform -translate-y-1/2 top-1/2 -right-[55%] w-[121%] h-1 bg-yellow-500'></div>}
                {route[1] === 'right' && <div className='absolute transform -translate-y-1/2 top-1/2 -left-2/3 w-[130%] h-1 bg-yellow-500'></div>}
                {route[1] === 'bottom' && <div className='absolute transform -translate-x-1/2 right-1/2 -top-2/3 w-1 h-[120%] bg-yellow-500'></div>}
              </div>
            </div>
          })}
        </div>
        }

        { routes.length > 0 &&
          <div className='absolute top-0 left-[102%] w-max h-full flex flex-col items-center'>
            <div className='w-full text-center bg-slate-600 py-2 text-white font-bold px-4'> Ada {routes.length} rute ditemukan </div>
            <div className='bg-slate-200 grow p-2 w-full h-[10rem] overflow-auto'>
              <ol className='text-white flex flex-col gap-y-2'>
                {routes.map((route, index)=>{
                  return (
                    <li onClick={()=>setSelected(index)} className={'bg-blue-500 hover:bg-blue-700 flex rounded-md overflow-hidden cursor-pointer border-blue-500 hover:border-blue-700 border-2 ' + 
                    (selected == index ? 'border-blue-700 bg-blue-700' : '')}>
                      <div className='px-2 bg-white text-blue-500'>{index+1}</div>
                      <div className='grow pl-1'>
                        {route.length} langkah
                      </div>
                    </li>
                )})}
              </ol>
            </div>
          </div>
        }
  
        {
        //seperate blocks into rows
        blocks.reduce((resultArray, item, index) => { 
          const chunkIndex = Math.floor(index/col)

          if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
          }

          resultArray[chunkIndex].push(item)

          return resultArray
        }, [] as MazeBlock[][])
          .map((row, x)=>{
          return <div key={x} className="flex">
            {row.map((block, y)=>{
              return <>
              <div key={(x*col)+y}
                className={"w-12 h-12 bg-gray-200 inline-block border-4 relative group select-none"
                + (block.top ? " border-t-gray-300 " : " border-t-black ")
                + (block.left ? " border-l-gray-300 " : " border-l-black ")
                + (block.right ? " border-r-gray-300 " : " border-r-black ")
                + (block.bottom ? " border-b-gray-300 " : " border-b-black ")
                + (start == (x*col)+y ? " !bg-blue-500 " : '')
                + (finish == (x*col)+y ? " !bg-green-500 " : '')}
              >
                <div className='w-full h-full'
                onClick={(e)=>{setStart((x*col)+y)}}
                onContextMenu={(e)=>{
                  e.preventDefault();
                  setFinish((x*col)+y);
                }}></div>

                <div className={'w-full h-full font-bold grid place-content-center pointer-events-none absolute top-0 left-0 z-[1]'
                + (start === (x*col)+y || finish === (x*col)+y? " text-white " : " text-gray-600 ")}
                >{(x*col)+y}</div>

                {/* wall overlay */}
                <div onClick={()=>setBlock((x*col)+y, 'left')} className='absolute top-0 h-full w-[30%] bg-blue-500 opacity-0 group-hover:opacity-20 hover:z-[1] hover:!opacity-100'></div>
                <div onClick={()=>setBlock((x*col)+y, 'top')} className='absolute top-0 w-full h-[30%] bg-blue-500 opacity-0 group-hover:opacity-20 hover:z-[1] hover:!opacity-100'></div>
                <div onClick={()=>setBlock((x*col)+y, 'right')} className='absolute top-0 h-full w-[30%] right-0 bg-blue-500 opacity-0 group-hover:opacity-20 hover:z-[1] hover:!opacity-100'></div>
                <div onClick={()=>setBlock((x*col)+y, 'bottom')} className='absolute bottom-0 w-full h-[30%] bg-blue-500 opacity-0 group-hover:opacity-20 hover:z-[1] hover:!opacity-100'></div>
              </div></>
            })}
          </div>
        })}
      </div>
      <button className='text-white bg-blue-500 p-2 rounded-md font-bold mt-5 w-11/12 self-center' onClick={()=>{setSelected(null);clearRoutes();solver()}}>
        Solve
      </button>
      <button className='text-white bg-red-500 p-2 rounded-md font-bold mt-5 w-11/12 self-center' onClick={()=>{clear()}}>
        Clear
      </button>
      <div className='w-11/12 self-center mt-4'>
        <div className='text-black w-full'>Kolom</div>
        <input type='number' className='text-black p-2 rounded-md font-bold w-full border border-black' value={col} onChange={(e)=>{!e.target.value ? setCol(1) : setCol(Number(e.target.value))}}/>
      </div>
      <div className='w-11/12 self-center mt-4'>
        <div className='text-black w-full'>Baris</div>
        <input type='number' className='text-black p-2 rounded-md font-bold w-full border border-black' value={row} onChange={(e)=>{!e.target.value ? setRow(1) :setRow(Number(e.target.value))}}/>
      </div>
      <div className='w-11/12 self-center mt-4'>
        <div className='text-black w-full'>Maks. Rute yang dicari</div>
        <input type='number' className='text-black p-2 rounded-md font-bold w-full border border-black' value={maxRoute} onChange={(e)=>{!e.target.value ? setMaxRoute(1) :setMaxRoute(Number(e.target.value))}}/>
      </div>
    </div>
  );
}

export default App;
