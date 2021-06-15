#!/usr/bin/env node
import { Function, FunctionTask } from 'cff-tools'
import { ViewerRequestFunction, ViewerResponseFunction } from '../lib/resources'


const publishFunction = async (targetFunction: Function) => {
    const task = new FunctionTask(targetFunction)
    const result = await task.publish()
    return result
}

const functions = [ViewerRequestFunction, ViewerResponseFunction];


Promise.all(functions.map(publishFunction))
.then(result => {
    console.log(result)
})
.catch(e => {
    console.error(e)
})