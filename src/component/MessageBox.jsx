import React, { useState, useEffect, useContext } from 'react';
import { Box, Layer, Text, Button, Nav, Grid, Card, CardHeader, CardBody, CardFooter, TextArea, ResponsiveContext, Spinner } from 'grommet';
import { Group, Close, Tools, Send, Refresh, CloudDownload, CloudUpload } from 'grommet-icons';
import { defaultExceptionMessage } from '../constant';
import { apiCall } from '../common';

const MessageBox = (props) => {
    const { push } = useContext(props.RouterContext);
    const size = useContext(ResponsiveContext);

    const [layer, setLayer] = useState();
    const [layer2, setLayer2] = useState();
    const [messageToggle, setMessageToggle] = useState(false);

    const [messageStatus, setMessageStatus] = useState(2);

    const [messages, setMessages] = useState([]);

    const [voteConvictionUserId, setVoteConvictionUserId] = useState();
    const [voteConvictionMessage, setVoteConvictionMessage] = useState();
    const [voteConvictionOpinion, setVoteConvictionOpinion] = useState();
    
    const [resultMessage, setResultMessage] = useState(defaultExceptionMessage);

    const onClose = () => setLayer2(undefined);

    const onOpen = (index) => {
        setLayer2(index);
        setTimeout(() => {
            setLayer2(undefined);
        }, 3000);
    };

    const findMessages = async () => {
        const response = await apiCall('GET', `/messages/${props.selectedGatheringId}?lang=ko`, null, push);

        if (response) {
            if (response.success) {
                const data = response.data;
                if (data) {
                    if (data.length > 0) {
                        setMessages(data);
                        setMessageStatus(0);
                    }
                    else {
                        setMessageStatus(1);
                    }
                }
                else {
                    setMessageStatus(1);
                }
            }
            else {
                setMessageStatus(1);
            }
        }
        else {
            setMessageStatus(1);
        }
    }

    const findSentMessages = async () => {
        const response = await apiCall('GET', `/messages/sent/${props.selectedGatheringId}?lang=ko`, null, push);

        if (response) {
            if (response.success) {
                const data = response.data;
                if (data) {
                    if (data.length > 0) {
                        setMessages(data);
                        setMessageStatus(0);
                    }
                    else {
                        setMessageStatus(1);
                    }
                }
                else {
                    setMessageStatus(1);
                }
            }
            else {
                setMessageStatus(1);
            }
        }
        else {
            setMessageStatus(1);
        }
    };

    const deleteMessage = async (id) => {
        const response = await apiCall('DELETE', `/message/${id}?lang=ko`, null, push);

        if (response) {
            if (response.success) {
                findMessages();
            }
            else {
                setResultMessage(response.message);
                onOpen(454);
            }
        }
        else {
            setResultMessage(defaultExceptionMessage);
            onOpen(454);
        }
    };

    const createVote = async () => {
        const response = await apiCall(
            'POST', 
            `/vote?lang=ko`, 
            {
                gatheringId: props.selectedGatheringId,
                description: '재판',
                voteProperty: 2,
                convictionUserId: voteConvictionUserId,
                convictionMessage: voteConvictionMessage,
                convictionOpinion: voteConvictionOpinion
            },
            push
        )

        if (response) {
            if (response.success) {
                setLayer(undefined);
                onOpen(27);
            }
            else {
                setResultMessage(response.message);
                onOpen(454);
            }
        }
        else {
            setResultMessage(defaultExceptionMessage);
            onOpen(454);
        }

        setVoteConvictionUserId(undefined);
        setVoteConvictionMessage(undefined);
        setVoteConvictionOpinion(undefined);
    };

    const refresh = async () => {
        setMessageStatus(2)
        if (messageToggle)
            findSentMessages();
        else
            findMessages();
    };

    useEffect(() => {
        refresh();
    }, [messageToggle]);

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
            {layer === 464 && (
                <Layer plain onClickOutside={() => setLayer(layer ? undefined : 464)} position="center" responsive={false}>
                    <Box
                        align="center"
                        justify="center"
                        gap="medium"
                        pad="medium"
                        background={{ "color": "dark-2" }}
                        border={{ "color": "active" }}
                        width={size === 'small' ? '288px' : 'medium'}
                        height={size === 'small' ? '288px' : 'medium'}
                        round="small"
                        elevation="small">
                        <Text textAlign="center" size={size} weight="bold">
                            신고
                        </Text>
                        <Text textAlign="center" size={size === 'small' ? 'xsmall' : 'small'}>
                            부당한 메시지에 대한 신고
                        </Text>
                        <TextArea size={size === 'small' ? 'xsmall' : 'small'} value={voteConvictionOpinion} onChange={event => setVoteConvictionOpinion(event.target.value)} resize="vertical" type="text" maxLength={255} fill={true} placeholder="내용 입력" />
                        <Box align="center" justify="center" direction="row" gap="small" pad="small">
                            <Button label="제출" size={size === 'small' ? 'xsmall' : 'small'} color="light-2" onClick={() => createVote()} disabled={voteConvictionOpinion === undefined || voteConvictionOpinion === ''} />
                            <Button label="닫기" size={size === 'small' ? 'xsmall' : 'small'} primary color="light-2" onClick={() => setLayer(layer ? undefined : 464)} />
                        </Box>
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
                    <Button icon={<Group color="dark-1" size={size === 'small' ? '20px' : '22px'} />} type="button" plain onClick={() => push('/gathering')} />
                    <Button icon={<Refresh color="dark-1" size={size === 'small' ? '20px' : '22px'} />} type="button" plain onClick={() => refresh()} />
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
                <></>
                <Box align="center" justify="center" direction="row" gap="small" pad="small">
                    {messageToggle ?
                        <Button size="small" icon={<CloudUpload color='dark-1' size={size === 'small' ? '16px' : '22px'} />} plain onClick={() => setMessageToggle(!messageToggle)} />
                        :
                        <Button size="small" icon={<CloudDownload color='dark-1' size={size === 'small' ? '16px' : '22px'} />} plain onClick={() => setMessageToggle(!messageToggle)} />
                    }
                </Box>
            </Box>
            <Box align="baseline" justify="between" overflow="auto" direction="row-responsive" responsive width="100%" pad="medium">
                <Grid columns={{ "size": size === 'small' ? 'small' : '288px', "count": "fit" }} pad="small" gap="small" width="100%">
                    {messageStatus === 0 ?
                        messages.map((message, key) => {
                            return (
                                <Card key={key} flex={false} background={{ 'color': 'light-3' }} elevation="xsmall" >
                                    <CardHeader>
                                        {messageToggle ?
                                            <Box align="center" justify="left" direction="row">
                                                <Box pad="medium">
                                                    <Send size={size === 'small' ? '16px' : '18px'} color="dark-4" />
                                                </Box>
                                                <Text size="small" weight="bold">{message.username}</Text>
                                            </Box>
                                            :
                                            <Box align="center" direction="row" justify="between" fill="horizontal">
                                                {message.messageProperty === 'NORMAL' ?
                                                    <Button size="small" icon={<Tools size={size === 'small' ? '16px' : '18px'} />} onClick={() => { setVoteConvictionUserId(message.sentUserId); setVoteConvictionMessage(message.content); setLayer(layer ? undefined : 464); }} />
                                                    :
                                                    <>&nbsp;</>
                                                }
                                                <Button size="small" icon={<Close size={size === 'small' ? '16px' : '18px'} />} onClick={() => deleteMessage(message.id)} />
                                            </Box>
                                        }
                                    </CardHeader>
                                    <CardBody>
                                        <Box pad="medium">
                                            <Text size="small" weight="normal" style={{ whiteSpace: 'pre-wrap' }}>
                                                {message.content}
                                            </Text>
                                        </Box>
                                    </CardBody>
                                    <CardFooter />
                                </Card>
                            )
                        }) :
                        messageStatus === 1 ?
                            <Box align="center" justify="center">
                                {messageToggle ?
                                    <Text size={size === 'small' ? 'xsmall' : 'small'} color="dark-4">
                                        당신은 어떠한 메시지도 보내지 않았습니다
                                    </Text>
                                    :
                                    <Text size={size === 'small' ? 'xsmall' : 'small'} color="dark-4">
                                        당신은 어떠한 메시지도 받지 못했습니다
                                    </Text>
                                }
                            </Box> :
                            <Box align="center" justify="center" pad={size === 'small' ? '28px' : '42px'}>
                                <Spinner color="dark-1" />
                            </Box>
                    }
                </Grid>
            </Box>
            <Box align="center" justify="between" flex={false} direction="row" pad="medium" fill="horizontal" />
        </Box>
    );
}

export default MessageBox;