import React from 'react';

// ThoughtList will recieve to props: the title and thoughts array.
// we destructure it to avoid using props.thoughts and props.title
const ThoughtList = ({ thoughts, title }) => {
    // if there is no data then return the following message
    if (!thoughts.length) {
        return <h3>No Thoughts Yet</h3>;
    }
    // if there is data then we return a list of thoughts using the .map() method
    return (
        <div>
            <h3>{title}</h3>
            {thoughts &&
                thoughts.map(thought => (
                    // key prop helps React internally track which data needs to be re-rendered if something changes
                    <div key={thought._id} className="card mb-3">
                        <p className="card-header">
                            {thought.username}
                            thought on {thought.createdAt}
                        </p>
                        <div className="card-body">
                            <p>{thought.thoughtText}</p>
                            <p className="mb-0">
                                {/* call to action: If there are no reactions, the user will start the discussion by adding the first reaction. If there are reactions, the user will view or add their own reaction to an existing list. */}
                                Reactions: {thought.reactionCount} || Click to{' '}
                                {thought.reactionCount ? 'see' : 'start'} the discussion!
                            </p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ThoughtList;