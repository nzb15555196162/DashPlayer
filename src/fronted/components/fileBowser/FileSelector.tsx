import React from 'react';
import useFile from '../../hooks/useFile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/fronted/components/ui/tooltip';
import { isSrt } from '@/common/utils/MediaTypeUtil';
import { SWR_KEY, swrMutate } from '@/fronted/lib/swr-util';

export interface OpenFileProps {
    child: (handleClick: () => void) => React.ReactNode;
    onSelected?: (vid: number) => void;
}

const api = window.electron;

export default function FileSelector({
                                          child, onSelected
                                      }: OpenFileProps) {
    const handleClick = async () => {
        const ps = await api.call('system/select-file', {
            mode: 'file',
            filter: 'none'
        });
        if (ps.length === 1 && isSrt(ps[0])) {
            const video = useFile.getState().videoFile;
            if (video?.path) {
                await api.call('watch-project/attach-srt', { videoPath: video.path, srtPath: ps[0] });
            }
        } else {
            const pid = await api.call('watch-project/create/from-files', ps);
            const v = await api.call('watch-project/video/detail/by-pid', pid);
            onSelected(v.id);
        }
        await swrMutate(SWR_KEY.PLAYER_P);
        await swrMutate(SWR_KEY.WATCH_PROJECT_LIST);
        await swrMutate(SWR_KEY.WATCH_PROJECT_DETAIL);
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {child(handleClick)}
                </TooltipTrigger>
                <TooltipContent>
                    可以同时选择一个视频文件及其对应的字幕文件
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

FileSelector.defaultProps = {
    onSelected: () => {
        //
    }
};
