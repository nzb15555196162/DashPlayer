import { ReactElement, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import hash from '../lib/hash';
import Word from './Word';
import usePlayerController from '../hooks/usePlayerController';
import useSetting, { isColorfulTheme } from '../hooks/useSetting';
import { cn, p } from '../../utils/Util';

interface TranslatableSubtitleLineParam {
    text: string;
}
const notWord = (str: string, key: string, showE: boolean): ReactElement => {
    return (
        <div
            className={`select-none mt-2 ${showE ? '' : 'text-transparent'}`}
            key={key}
        >
            {str}
        </div>
    );
};
const TranslatableLine = ({ text }: TranslatableSubtitleLineParam) => {
    const themeName = useSetting((s) => s.appearance.theme);
    const show = usePlayerController((state) => state.showEn);
    const sentenceStruct = usePlayerController((state) =>
        state.subTitlesStructure.get(p(text))
    );
    console.log('TranslatableLine', text, 'dd');
    const [popELe, setPopEle] = useState<string | null>(null);
    const [hovered, setHovered] = useState(false);
    const textHash = hash(text);
    const handleRequestPop = (k: string) => {
        if (popELe !== k) {
            setPopEle(k);
        }
    };

    return text === undefined ? (
        <div />
    ) : (
        <div
            onMouseOver={() => {
                setHovered(true);
            }}
            onMouseLeave={() => {
                setHovered(false);
            }}
            className={twJoin(
                'flex flex-wrap justify-center items-center rounded-lg drop-shadow-md text-mainSubtitleOne text-mainSubtitleOneColor mx-10 mt-2.5 px-10 pt-0.5 pb-2.5 shadow-inner shadow-sentenceInnerShadow z-50 gap-2',
                isColorfulTheme(themeName)
                    ? 'bg-sentenceBackground/80'
                    : 'bg-sentenceBackground'
            )}
        >
            {sentenceStruct?.blocks.map((block, blockIndex) => {
                return (
                    <div className={cn('flex')}>
                        {block.blockParts.map((part, partIndex) => {
                            const partId = `${textHash}:${blockIndex}:${partIndex}`;
                            if (part.isWord) {
                                return (
                                    <Word
                                        key={partId}
                                        word={part.content}
                                        pop={popELe === partId}
                                        requestPop={() =>
                                            handleRequestPop(partId)
                                        }
                                        show={show || hovered}
                                    />
                                );
                            }
                            return notWord(
                                part.content,
                                partId,
                                show || hovered
                            );
                        })}
                    </div>
                );
            }) || []}
        </div>
    );
};

export default TranslatableLine;
