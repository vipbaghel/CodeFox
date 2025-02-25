import { firestore } from '@/firebase/firebase';
import { problems } from '@/mockProblems/problems';
import { DBProblem } from '@/utils/types/problem';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { AiFillYoutube } from 'react-icons/ai';
import { BsCheckCircle } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import YouTube, { YouTubePlayer } from 'react-youtube';

type ProblemsTableProps = {
    setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProblemsTable:React.FC<ProblemsTableProps> = ({ setLoadingProblems }) => {

    
    
   const [youTubePlayer,setYoutubePlayer] = useState({
    isOpen:false,
    vedioId:""
   });
   const problems = useGetProblems(setLoadingProblems)
   const closeModal=()=>{
    setYoutubePlayer({isOpen:false,vedioId:""})
   }

   useEffect(()=>{
    const handleEsc = (e:KeyboardEvent) =>{
        if(e.key==="Escape") closeModal();
    }
window.addEventListener("keydown" ,handleEsc)
return ()=> window.removeEventListener("keydown", handleEsc);
   },[]);

    return(
        <>
        <tbody className='text-white'>
            {
                problems.map((problem,idx)=>{
                    const difficultyColor = problem.difficulty === "Easy" ? "text-dark-green-s" : problem.difficulty==="Medium" ? "text-dark-yellow" :"text-dark-pink";
                    return (
                        <tr className={`${idx%2==1 ? ' bg-dark-layer-1' : ''}`}  key={problem.id}>
                            <th className=" px-2 py-4 font-medium  whitespace-nowrap text-dark-green-s ">
                                <BsCheckCircle fontSize={'18'} width="18" />
                            </th>
                            <td className='px-6 py-4'>
                            {problem.link ? (
									<Link
										href={problem.link}
										className='hover:text-blue-600 cursor-pointer'
										target='_blank'
									>
										{problem.title}
									</Link>
								) : (
									<Link
										className='hover:text-blue-600 cursor-pointer'
										href={`/problems/${problem.id}`}
									>
										{problem.title}
									</Link>
								)}
                            </td>
                            <td className={`px-6 py-4 ${difficultyColor}`}> {problem.difficulty}</td>
                            <td className={"px-6 py-4"}>{problem.category}</td>
                            <td className='px-6 py-4'>
                                {
                                    problem.videoId?(
                                        <AiFillYoutube  fontSize={"28"} className='cursor-pointer hover:text-red-600' onClick={()=>setYoutubePlayer({isOpen:true,vedioId:problem.videoId as string })} />
                                    ): (
                                        <p className=' text-gray-400'> coming soon</p>
                                    )
                                }
                            </td>

                        </tr>
                    )
                })
            }

        </tbody>
        { youTubePlayer.isOpen &&  (
        <tfoot className='fixed top-0 left-0 h-screen w-screen flex items-center justify-center'>
					<div
						className='bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute'
						
                        onClick={closeModal} ></div>
					<div className='w-full z-50 h-full px-6 relative max-w-4xl'>
						<div className='w-full h-full flex items-center justify-center relative' >
							<div className='w-full relative'>
								<IoClose
									fontSize={"35"}
									className='cursor-pointer absolute -top-16 right-0'
									onClick={closeModal}
								/>
								<YouTube
									videoId={youTubePlayer.vedioId}
									loading='lazy'
									iframeClassName='w-full min-h-[500px]'
								/>
							</div>
						</div>
					</div>
				</tfoot>
        )
}

        
        </>
    );
};
export default ProblemsTable;


function useGetProblems(setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>) {
	const [problems, setProblems] = useState<DBProblem[]>([]);

	useEffect(() => {
		const getProblems = async () => {
			// fetching data logic
			setLoadingProblems(true);
			const q = query(collection(firestore, "problems"), orderBy("order", "asc"));
			const querySnapshot = await getDocs(q);
			const tmp: DBProblem[] = [];
			querySnapshot.forEach((doc) => {
				tmp.push({ id: doc.id, ...doc.data() } as DBProblem);
			});
			setProblems(tmp);
			setLoadingProblems(false);
		};

		getProblems();
	}, [setLoadingProblems]);
	return problems;
}