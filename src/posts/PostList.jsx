import React, {useEffect, useState} from "react"
import {connect} from "react-redux"
import axios from "axios"
import {Link} from "react-router-dom"
import {getRandomTextColor} from "../common/utils"
import {
    JSON_PLACEHOLDER_URL,
    POST_LIST_URL
} from "../common/Constants"
import {postListSelector, postNumSelector, recordFullPostList} from "./PostReducer"
import PostNumInput from "./PostNumInput";

const mapStateToProps = state => {
    return {
        postList: postListSelector(state),
        postNum: postNumSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        recordFullPostList: postList => dispatch(recordFullPostList(postList))
    }
}

const PostList = ({
                      postList,
                      postNum,
                      recordFullPostList
                  }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        axios.get(JSON_PLACEHOLDER_URL + "/posts")
            .then(response => {
                recordFullPostList(response.data)
                setIsLoading(false)
            })
            .catch(() => setIsError(true))
        return () => {
            recordFullPostList([])
        };
    }, [recordFullPostList]);

    const createPosts = num => {
        if (isError) {
            return (
                <h2 className="container text-danger">
                    <br/>
                    Some Error occurred, please check your input
                </h2>
            )
        } else if (isLoading) {
            return (
                <h2 className="container text-danger">
                    <br/>
                    Loading Posts
                </h2>
            )
        } else if (parseInt(num) === 0) {
            return (
                <h2 className="container text-danger">
                    <br/>
                    Come on, you got to see some posts!
                </h2>
            )
        } else {
            return (
                selectRandomPosts(num).map(post => {
                    return (
                        <div key={post.id}>
                            <br/>
                            <Link to={POST_LIST_URL + "/" + post.id}>
                                <h5>
                                    {post.title}
                                </h5>
                            </Link>
                            <p className={getRandomTextColor()}>
                                {post.body}
                            </p>
                        </div>
                    )
                })
            )
        }
    }

    const selectRandomPosts = num => {
        const postListLength = postList.length
        num = Math.min(num, postListLength)
        let i = 0,
            randomNumList = [],
            fullNumList = [],
            randomPostList = []
        while (i < postListLength) {
            fullNumList.push(i)
            i++
        }
        i = 0
        while (i < num) {
            const randomIndex = Math.floor(Math.random() * fullNumList.length)
            const randomNum = fullNumList.splice(randomIndex, 1)
            randomNumList.push(randomNum[0])
            i++
        }
        for (const randomNum of randomNumList) {
            randomPostList.push(postList[randomNum])
        }
        return randomPostList
    }

    return (
        <div className="container">
            <PostNumInput />
            {createPosts(postNum)}
        </div>
    )
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostList)
