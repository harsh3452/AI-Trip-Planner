import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function Customloading({ cusloading }) {
    return (
        <div>
            <AlertDialog open={cusloading}>
                <AlertDialogContent>
                <div className='flex flex-col items-center justify-center my-10 '>
                    <img src="/progress.gif" alt="" className='w-[100px] h-[100px]' />
                    <h2 className='text-lg font-semibold'>Generating your Trip.....  Do not Refresh</h2>
                </div>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}

export default Customloading
