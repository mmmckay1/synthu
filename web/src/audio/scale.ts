export function positionToCutoff(position: number): number{
    return 20*1000**position
}

export function cutoffToPosition(cutoff: number): number{
    return Math.log(cutoff/20)/Math.log(1000)
}

export function positionToLinear(position: number, min: number, max: number): number{
    return min + position*(max-min)
}

export function linearToPosition(value: number, min: number, max: number): number{
    return (value-min)/(max-min)
}

export function positionToLog(position: number, min: number, max: number): number{
    return min*(max/min)**position
}

export function logToPosition(value: number, min: number, max: number): number{
    return Math.log(value/min)/Math.log(max/min)
}