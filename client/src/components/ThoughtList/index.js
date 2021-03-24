import React from 'react';
import { Link } from 'react-router-dom';
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
                            <Link
                                to={`/profile/${thought.username}`}
                                style={{ fontWeight: 700 }}
                                className='text-light'
                            >{thought.username}</Link>{' '}
                            thought on {thought.createdAt}
                        </p>
                        <div className="card-body">
                            <Link to={`/thought/${thought._id}`}>
                                <p>{thought.thoughtText}</p>
                                <p className="mb-0">
                                    Reactions: {thought.reactionCount} || Click to{' '}
                                    {thought.reactionCount ? 'see' : 'start'} the discussion!
                                </p>
                            </Link>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ThoughtList;