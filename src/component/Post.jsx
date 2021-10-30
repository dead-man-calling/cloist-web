import React, { useState, useEffect, useContext } from 'react';
import { Box, Layer, Text, TextInput, Button, Nav, Grid, TextArea, ResponsiveContext, Spinner } from 'grommet';
import { Book, Group, ChatOption, Chat } from 'grommet-icons';
import { defaultExceptionMessage } from '../constant';
import { apiCall } from '../common';
import PostElement from './PostElement';

const Post = (props) => {
    const { push } = useContext(props.RouterContext);
    const size = useContext(ResponsiveContext);

    const [layer1, setLayer1] = useState();
    const [layer2, setLayer2] = useState();

    const [loadStatus, setLoadStatus] = useState(false);
    const [postStatus, setPostStatus] = useState(false);
    
    let page = 0;
    let pageSize = 30;
    let prePosts = [];

    const [posts, setPosts] = useState([]);

    const [prePostTitle, setPrePostTitle] = useState();
    const [prePostContent, setPrePostContent] = useState();

    const [selectedPostId, setSelectedPostId] = useState();

    const [preComment, setPreComment] = useState();

    const [commentToggle, setCommentToggle] = useState(false);

    const [resultMessage, setResultMessage] = useState(defaultExceptionMessage);

    const onClose = () => setLayer2(undefined);

    const onOpen = (index) => {
        setLayer2(index);
        setTimeout(() => {
            setLayer2(undefined);
        }, 3000);
    };

    const findPosts = async () => {
        const response = await apiCall(
            'GET', 
            `/posts/page/${props.selectedGatheringId}?page=${page++}&size=${pageSize}&sort=createdAt,desc&lang=ko`,
            null,
            push
        );
        
        if (response) {
            if (response.success) {
                const data = response.data;
                if (data) {
                    if (data.length > 0) {
                        prePosts = [...prePosts, ...data];
                        setPosts(prePosts);
                        if (data.length < pageSize) {
                            setLoadStatus(true);
                            if (prePosts.length === 0)
                                setPostStatus(true);
                        }
                    }
                    else {
                        setLoadStatus(true);
                        if (prePosts.length === 0)
                            setPostStatus(true);
                    }
                }
            }
            else {
                setLoadStatus(true);
                if (prePosts.length === 0)
                    setPostStatus(true);
            }
        }
        else {
            setLoadStatus(true);
            if (prePosts.length === 0)
                setPostStatus(true);
        }
    };

    const createPost = async () => {
        const response = await apiCall(
            'POST', 
            `/post?lang=ko`,
            {
                gatheringId: props.selectedGatheringId,
                title: prePostTitle,
                content: prePostContent
            },
            push
        );

        if (response) {
            if (response.success) {
                setPosts([response.data, ...posts]);
                setLayer1(undefined);
                setPrePostTitle(undefined);
                setPrePostContent(undefined);
                setPostStatus(false);
                onOpen(27);
            }
            else {
                setResultMessage(response.message);
                onOpen(454);
            }
        } 
        else {
            setResultMessage(defaultExceptionMessage)
            onOpen(454);
        }
    };

    const createPostComment = async () => {
        const response = await apiCall(
            'POST', 
            `/post/comment?lang=ko`, 
            { postId: selectedPostId, content: preComment },
            push
        );

        if (response) {
            if (response.success) {
                setLayer1(undefined);
                setPreComment(undefined);
                setCommentToggle(!commentToggle);
                onOpen(27);
            }
            else {
                setResultMessage(response.message);
                onOpen(454);
            }
        }
        else {
            setResultMessage(defaultExceptionMessage)
            onOpen(454);
        }
    };

    const option = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const callback = (entries, option) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                findPosts();
            }
        });
    };

    const observer = new IntersectionObserver(callback, option);

    useEffect(() => {
        if (loadStatus)
            observer.unobserve(document.querySelector('#post-spinner'));
        else
            observer.observe(document.querySelector('#post-spinner'));
    }, [loadStatus]);

    return (
        <Box fill="vertical" overflow="auto" align="center" flex="grow" direction="column" justify="start" background={{ "color": "light-2" }} animation="fadeIn">
            {layer2 === 27 && (
                <Layer position="bottom" modal={false} margin={{ bottom: 'medium' }} responsive={false} onClickOutside={() => onClose()} plain>
                    <Box align="center"
                        gap="small"
                        justify="center"
                        round="small"
                        pad="medium"
                        width={size === 'small' ? '288px' : 'medium'}
                        background="status-ok">
                        <Text size="xsmall" style={{ color: 'white' }}>
                            당신의 뜻이 하늘에 닿았습니다
                        </Text>
                    </Box>
                </Layer>
            )}
            {layer2 === 454 && (
                <Layer position="bottom" modal={false} margin={{ bottom: 'medium' }} responsive={false} onClickOutside={() => onClose()} plain>
                    <Box align="center"
                        gap="small"
                        justify="center"
                        round="small"
                        pad="medium"
                        width={size === 'small' ? '288px' : 'medium'}
                        background="status-error">
                        <Text size="xsmall">
                            {resultMessage}
                        </Text>
                    </Box>
                </Layer>
            )}
            {layer1 === 129 && (
                <Layer plain onClickOutside={() => setLayer1(layer1 ? undefined : 129)} position="center" responsive={false}>
                    <Box
                        align="center"
                        justify="center"
                        pad="medium"
                        gap="medium"
                        round="small"
                        elevation="small"
                        background={{ "color": "dark-2" }}
                        width={size === 'small' ? '288px' : 'medium'}
                        height={size === 'small' ? '288px' : 'medium'}
                        border={{ "color": "active" }}>
                        <Text size={size} weight="bold" pad="small">
                            게시글 작성
                        </Text>
                        <TextInput size={size === 'small' ? 'xsmall' : 'small'} value={prePostTitle} onChange={event => setPrePostTitle(event.target.value)} type="text" maxLength={24} placeholder="제목 입력" icon={<Book size={size} color="dark-4" />} />
                        <TextArea size={size === 'small' ? 'xsmall' : 'small'} value={prePostContent} onChange={event => setPrePostContent(event.target.value)} resize="vertical" type="text" maxLength={255} fill={true} placeholder="내용 입력" />
                        <Button label="완료" size={size === 'small' ? 'xsmall' : 'small'} color="light-2" onClick={() => createPost()} disabled={prePostTitle === undefined || prePostContent === undefined || prePostTitle === '' || prePostContent === ''} />
                    </Box>
                </Layer>
            )}
            {layer1 === 130 && (
                <Layer plain onClickOutside={() => setLayer1(layer1 ? undefined : 129)} position="center" responsive={false}>
                    <Box
                        align="center"
                        justify="center"
                        pad="medium"
                        gap="medium"
                        round="small"
                        elevation="small"
                        background={{ "color": "dark-2" }}
                        width={size === 'small' ? '288px' : 'medium'}
                        border={{ "color": "active" }}>
                        <Text size={size} weight="bold" pad="small">
                            댓글 작성
                        </Text>
                        <TextInput size={size === 'small' ? 'xsmall' : 'small'} value={preComment} onChange={event => setPreComment(event.target.value)} placeholder="내용 입력" />
                        <Button label="완료" size={size === 'small' ? 'xsmall' : 'small'} color="light-2" onClick={() => createPostComment()} disabled={preComment === undefined || preComment === ''} />
                    </Box>
                </Layer>
            )}
            <Box align="center" justify="between" flex={false} direction="row" pad="medium" fill="horizontal">
                <Box align="center" justify="center" direction="row" pad="small">
                    <Text textAlign="center" color="dark-1" size={size === 'small' ? 'medium' : 'large'} style={{ fontFamily: 'Pacifico' }}>
                        Cloist.
                    </Text>
                </Box>
                <Nav align="center" flex={false} direction="row" pad="small" justify="center" gap={size === 'small' ? '20px' : '22px'}>
                    <Button icon={<Chat color="dark-1" size={size === 'small' ? '20px' : '22px'} />} type="button" plain onClick={() => setLayer1(layer1 ? undefined : 129)} />
                    <Button icon={<Group color="dark-1" size={size === 'small' ? '20px' : '22px'} />} type="button" plain onClick={() => push('/gathering')} />
                </Nav>
            </Box>
            <Box align="center" justify="center" direction="column" gap="medium" pad="medium" flex={false} fill="horizontal" responsive>
                <Box align="center" justify="center" direction="column" gap="small">
                    <Text textAlign="center" weight="bold" size={size === 'small' ? 'medium' : 'large'}>
                        {props.selectedGatheringName ? props.selectedGatheringName : <>&nbsp;</>}
                    </Text>
                    <Text textAlign="center" size={size}>
                        수도회
                    </Text>
                </Box>
                <Box align="center" justify="center" direction="row" gap="small" pad="small">
                    <Box pad="medium">
                        <ChatOption color='dark-4' size={size === 'small' ? '16px' : '22px'} />
                    </Box>
                </Box>
            </Box>
            <Box align="baseline" justify="between" overflow="auto" direction="row-responsive" responsive width="100%" pad="medium">
                <Grid columns={{ "size": "horizontal", "count": "fit" }} pad="small" gap="small" width="100%">
                    {posts.map((post, key) => {
                        return (
                            <PostElement key={key} post={post} push={push} setLayer={setLayer1} selectedPostId={selectedPostId} setSelectedPostId={setSelectedPostId} commentToggle={commentToggle} />
                        )
                    })}
                    <Box align="center" justify="center">
                        <Text size={size === 'small' ? 'xsmall' : 'small'} color="dark-4" style={{display: postStatus ? 'inherit' : 'none' }}>
                            어떠한 글도 존재하지 않습니다
                        </Text>
                    </Box>
                    <Box id="post-spinner" align="center" justify="center" pad={size === 'small' ? '11px' : '21px'} style={{display: loadStatus ? 'none' : 'inherit' }}>
                        <Spinner color="dark-1" />
                    </Box>
                </Grid>
            </Box>
            <Box align="center" justify="between" flex={false} direction="row" pad="medium" fill="horizontal" />
        </Box>
    );
}

export default Post;