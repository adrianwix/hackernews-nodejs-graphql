async function feed(parent, args, context, info) {
    const { skip, first, orderBy } = args;
    const where = args.filter
        ? {
            OR: [
                { url_contains: args.filter },
                { description_contains: args.filter },
            ],
        }
        : {};

    // 1
    const queriedLinks = await context.db.query.links(
        { where, skip, first, orderBy },
        `{ id }`,
    );

    // 2
    const countSelectionSet = `
    {
      aggregate {
        count
      }
    }
  `;
    const linksConnection = await context.db.query.linksConnection({}, countSelectionSet);

    // 3
    return {
        count: linksConnection.aggregate.count,
        linkIds: queriedLinks.map(link => link.id),
    }
}

module.exports = {
    feed,
};