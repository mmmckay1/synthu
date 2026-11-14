export function positionToCutoff(position: number): number{
    return 20*1000**position
}

export function cutoffToPosition(cutoff: number): number{
    return Math.log(cutoff/20)/Math.log(1000)
}