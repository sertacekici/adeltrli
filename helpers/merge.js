const transformResult = (result) => {
    return {
        id: result.id,
        ...result.doc
    }
}

exports.transformResult = transformResult;