import React, { useState, useEffect, useContext } from 'react';
import { Box, Layer, Text, TextInput, Button, Nav, Grid, Card, CardHeader, CardBody, CardFooter, TextArea, List, RadioButtonGroup, ResponsiveContext, Spinner } from 'grommet';
import { Menu, Close, Trophy, Trigger, Tools, User, Phone, UserAdd, Inbox, Send, Radial, Refresh, Plan, CaretLeftFill, CaretRightFill } from 'grommet-icons';
import { defaultExceptionMessage, regKorName, regPhone, prizeTitles, cautionTitles, emptyString } from '../constant';
import { apiCall } from '../common';

const Gathering = (props) => {
    const { push } = useContext(props.RouterContext);
    const size = useContext(ResponsiveContext);

    const [titleIndex, setTitleIndex] = useState(0);
    const [prizeTitle, setPrizeTitle] = useState(prizeTitles[titleIndex]);
    const [cautionTitle, setCautionTitle] = useState(cautionTitles[titleIndex]);

    const [layer1, setLayer1] = useState();
    const [layer2, setLayer2] = useState();
    const [voteToggle, setVotetoggle] = useState(false);
    const [submitToggle, setSubmitToggle] = useState(false);

    const [prizeVotes, setPrizeVotes] = useState(props.selectedPrizeVotes);
    const [cautionVotes, setCautionVotes] = useState(props.selectedCautionVotes);
    const [convictionVotes, setConvictionVotes] = useState(props.selectedConvictionVotes);

    const [users, setUsers] = useState([]);

    const [inviteUsername, setInviteUsername] = useState();
    const [invitePhoneNumber, setInvitePhoneNumber] = useState();

    const [userSelfId, setUserSelfId] = useState();

    const [preUserId, setPreUserId] = useState();
    const [preUsername, setPreUsername] = useState();
    const [preMessage, setPreMessage] = useState();

    const [voteUsers, setVoteUsers] = useState([]);
    const [voteProperty, setVoteProperty] = useState();
    const [voteDescription, setVoteDescription] = useState();
    const [voteConvictionUserId, setVoteConvictionUserId] = useState();
    const [voteConvictionMessage, setVoteConvictionMessage] = useState();
    const [voteConvictionOpinion, setVoteConvictionOpinion] = useState();

    const [convictionVote, setConvictionVote] = useState();

    const [userStatus, setUserStatus] = useState(false);

    const [resultMessage, setResultMessage] = useState(defaultExceptionMessage);

    const onClose = () => setLayer2(undefined);

    const onOpen = (index) => {
        setLayer2(index);
        setTimeout(() => {
            setLayer2(undefined);
        }, 3000);
    };

    const confirm = () => {
        if (inviteUsername === undefined || regKorName.test(inviteUsername) === false)
            return true;

        if (invitePhoneNumber === undefined || regPhone.test(invitePhoneNumber) === false)
            return true;

        return false;
    };

    const select = (isPrize, isRight) => {
        const index = isRight ?
            titleIndex + 1 > 4 ? 0 : titleIndex + 1 :
            titleIndex - 1 < 0 ? 4 : titleIndex - 1;
        if (isPrize)
            setPrizeTitle(prizeTitles[index]);
        else
            setCautionTitle(cautionTitles[index]);
        setTitleIndex(index);
    }

    const refresh = async () => {
        const response1 = await apiCall('GET', `/gathering/${props.selectedGatheringId}?lang=ko`, null, push);

        if (response1) {
            setPrizeVotes(response1.data.prizeVotes);
            setCautionVotes(response1.data.cautionVotes);
            setConvictionVotes(response1.data.convictionVotes);
        }

        setUserStatus(false);

        const response2 = await apiCall('GET', `/users/${props.selectedGatheringId}?lang=ko`, null, push);

        if (response2) {
            const data = response2.data;
            if (data) {
                data.sort((a, b) => a.username > b.username ? 1 : a.username < b.username ? -1 : 0);

                let finalUsers = [];
                let voteUsers = [];

                let self = {};

                for (let i = 0; i < data.length; i++) {
                    if (data[i].isSelf === false) {
                        finalUsers.push(data[i]);
                        voteUsers.push({ name: data[i].username, data: [data[i].id] });
                    }
                    else {
                        setUserSelfId(data[i].id);
                        self = data[i];
                    }
                }

                finalUsers.unshift(self);

                setUsers(finalUsers);
                setVoteUsers(voteUsers);

                setUserStatus(true);
            }
        }
    };

    const withdraw = async () => {
        const response = await apiCall('PUT', `/gathering/${props.selectedGatheringId}?lang=ko`, null, push);

        if (response) {
            if (response.success) {
                setLayer1(267);
                push('/main');
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

    const invite = async () => {
        const response = await apiCall(
            'POST',
            `/gathering/${props.selectedGatheringId}?lang=ko`,
            { username: inviteUsername, phoneNumber: invitePhoneNumber },
            push
        );

        if (response) {
            if (response.success) {
                setLayer1(undefined);
                refresh();
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

    const sendMessage = async () => {
        const response = await apiCall(
            'POST',
            `/message?lang=ko`,
            { userId: preUserId, gatheringId: props.selectedGatheringId, content: preMessage, messageProperty: 'NORMAL' },
            push
        );

        if (response) {
            if (response.success) {
                setPreUserId(undefined);
                setPreUsername(undefined);
                setPreMessage(undefined);
                setLayer1(layer1 ? undefined : 129);
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
    };

    const findVote = async (property, layer) => {
        setVoteProperty(property);

        const response = await apiCall(
            'POST',
            `/vote/view?lang=ko`,
            { gatheringId: props.selectedGatheringId, voteProperty: property },
            push
        );

        if (response) {
            if (response.success) {
                if (response.data.existProperty === 'EXIST') {
                    setVoteDescription(response.data.description);
                    setVoteConvictionUserId(response.data.convictionUserId);
                    setVoteConvictionMessage(response.data.convictionMessage);
                    setVoteConvictionOpinion(response.data.convictionOpinion);
                    setVotetoggle(true);
                    setLayer1(layer);
                }
                else if (response.data.existProperty === 'FINISHED') {
                    setVotetoggle(false);
                    if (property === 'PRIZE')
                        setPrizeVotes(prizeVotes - 1);
                    else if (property === 'CAUTION')
                        setCautionVotes(cautionVotes - 1);
                    else
                        setConvictionVotes(convictionVotes - 1);
                    setLayer1(layer);
                }
                else {
                    setVotetoggle(false);
                    setLayer1(layer);
                }
            }
            else {
                setVotetoggle(false);
                setResultMessage(response.message);
                onOpen(454);
            }
        }
        else {
            setResultMessage(defaultExceptionMessage);
            onOpen(454);
        }
    };

    const createVote = async (property) => {
        const response = await apiCall(
            'POST',
            `/vote?lang=ko`,
            {
                gatheringId: props.selectedGatheringId,
                description: property === 0 ? prizeTitle : cautionTitle,
                voteProperty: property
            },
            push
        );

        if (response) {
            if (response.success) {
                if (property === 0)
                    setPrizeVotes(prizeVotes + 1);
                else
                    setCautionVotes(cautionVotes + 1);
                setVoteDescription(property === 0 ? prizeTitle : cautionTitle);
                setVotetoggle(true);
            }
            else {
                setVotetoggle(false);
            }
        }
        else {
            setResultMessage(defaultExceptionMessage);
            onOpen(454);
        }
    };

    const vote = async (id, agreed) => {
        const response = await apiCall(
            'PUT',
            `/vote?lang=ko`,
            {
                gatheringId: props.selectedGatheringId,
                voteProperty: voteProperty,
                receivedUserId: id,
                agreed: agreed
            },
            push
        );

        if (response) {
            if (response.success) {
                if (response.data) {
                    if (voteProperty === 'PRIZE')
                        setPrizeVotes(prizeVotes - 1);
                    else if (voteProperty === 'CAUTION')
                        setCautionVotes(cautionVotes - 1);
                    else
                        setConvictionVotes(convictionVotes - 1);
                    setLayer1(undefined);
                }
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
    };

    const preset = (id, username) => {
        setPreUserId(id);
        setPreUsername(username);
        setLayer1(layer1 ? undefined : 129);
    };

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        setSubmitToggle(confirm());
    }, [inviteUsername, invitePhoneNumber]);

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
            {layer2 === 197 && (
                <Layer modal position="top" onClickOutside={() => setLayer2(layer2 ? undefined : 197)} animate responsive={false}>
                    <Box align="center" justify="center" direction="column" pad="medium" gap="medium" background={{ "color": "dark-1" }} width="medium" height="small">
                        <Text textAlign="center" size={size} weight="bold">
                            선택
                        </Text>
                        <Box align="baseline" justify="center" overflow="auto" width="medium" direction="row" height="medium">
                            <List data={voteUsers} onOrder={false} onClickItem={(e) => vote(e.item.data[0], true)} />
                        </Box>
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
                        border={{ "color": "active" }}>
                        <Box direction="row" gap="small" align="center" justify="center">
                            <Send size={size === 'small' ? '16px' : '22px'} color="dark-4" />
                            <Text size={size} weight="bold" pad="small">
                                {preUsername}
                            </Text>
                        </Box>
                        <TextArea size={size === 'small' ? 'xsmall' : 'small'} value={preMessage} onChange={event => setPreMessage(event.target.value)} resize="vertical" type="text" maxLength={255} fill={true} focusIndicator={false} placeholder="내용 입력" />
                        <Button label="전송" size={size === 'small' ? 'xsmall' : 'small'} color="light-2" onClick={() => sendMessage()} disabled={preMessage === undefined || preMessage === ''} />
                    </Box>
                </Layer>
            )}
            {layer1 === 155 && (
                <Layer plain onClickOutside={() => { setTitleIndex(0); setLayer1(layer1 ? undefined : 155) }} position="center" responsive={false}>
                    <Box
                        align="center"
                        justify="center"
                        gap="medium"
                        pad="medium"
                        background={{ "color": "light-3" }}
                        width={size === 'small' ? '288px' : 'medium'}
                        round="small"
                        elevation="small">
                        <Text textAlign="center" size={size} weight="bold">
                            축복을 위한 기도회
                        </Text>
                        <Text textAlign="center" size={size === 'small' ? 'xsmall' : 'small'}>
                            상대의 축복을 바라는 기도를 드립니다
                        </Text>
                        <Box align="baseline" width="100%" justify="between" overflow="auto" direction="row-responsive">
                            <Grid rows={size === 'small' ? 'xsmall' : 'small'} width="100%">
                                {voteToggle ?
                                    <Card flex={false} justify="center" direction="column" align="center" background={{ "color": "status-ok" }} onClick={() => { setLayer2(layer2 ? undefined : 197) }} style={{ outline: 'none' }} focusIndicator={false} elevation="none" >
                                        <CardBody justify="center" direction="row" align="center" width="100%">
                                            <Box width="10%" height="100%" justify="center" align="center">
                                            </Box>
                                            <Box justify="center" align="center" direction="column" width="80%" height="100%">
                                                <Text textAlign="center" size="small" color="light-2">
                                                    가장 {voteDescription} 자에게 축복을
                                                </Text>
                                            </Box>
                                            <Box width="10%" height="100%" justify="center" align="center">
                                            </Box>
                                        </CardBody>
                                    </Card> :
                                    <Card flex={false} justify="center" direction="column" align="center" background={{ "color": "dark-3" }} elevation="none" >
                                        <CardBody justify="center" direction="row" align="center" width="100%">
                                            <Box width="10%" height="100%" justify="center" align="center" onClick={() => select(true, false)} style={{ outline: 'none' }} focusIndicator={false}>
                                                <CaretLeftFill size="medium" color="dark-2" />
                                            </Box>
                                            <Box justify="center" align="center" direction="column" width="80%" height="100%" style={{ outline: 'none' }} focusIndicator={false} onClick={() => createVote(0)}>
                                                <Text textAlign="center" size="small">
                                                    가장 {prizeTitle} 자에게 축복을
                                                </Text>
                                            </Box>
                                            <Box width="10%" height="100%" justify="center" align="center" onClick={() => select(true, true)} style={{ outline: 'none' }} focusIndicator={false}>
                                                <CaretRightFill size="medium" color="dark-2" />
                                            </Box>
                                        </CardBody>
                                    </Card>}
                            </Grid>
                        </Box>
                    </Box>
                </Layer>
            )}
            {layer1 === 169 && (
                <Layer plain onClickOutside={() => { setTitleIndex(0); setLayer1(layer1 ? undefined : 169) }} position="center" responsive={false}>
                    <Box
                        align="center"
                        justify="center"
                        gap="medium"
                        pad="medium"
                        background={{ "color": "light-3" }}
                        width={size === 'small' ? '288px' : 'medium'}
                        round="small"
                        elevation="small">
                        <Text textAlign="center" size={size} weight="bold">
                            각성을 위한 기도회
                        </Text>
                        <Text textAlign="center" size={size === 'small' ? 'xsmall' : 'small'}>
                            상대가 각성하기를 바라는 기도를 드립니다
                        </Text>
                        <Box align="baseline" justify="between" overflow="auto" direction="row-responsive" width="100%">
                            <Grid rows={size === 'small' ? 'xsmall' : 'small'} width="100%">
                                {voteToggle ?
                                    <Card flex={false} justify="center" direction="column" align="center" background={{ "color": "accent-4" }} onClick={() => { setLayer2(layer2 ? undefined : 197) }} style={{ outline: 'none' }} focusIndicator={false} elevation="none" >
                                        <CardBody justify="center" direction="row" align="center" width="100%">
                                            <Box width="10%" height="100%" justify="center" align="center">
                                            </Box>
                                            <Box justify="center" align="center" direction="column" width="80%" height="100%">
                                                <Text textAlign="center" size="small">
                                                    가장 {voteDescription} 자에게 경고를
                                                </Text>
                                            </Box>
                                            <Box width="10%" height="100%" justify="center" align="center">
                                            </Box>
                                        </CardBody>
                                    </Card> :
                                    <Card flex={false} justify="center" direction="column" align="center" background={{ "color": "dark-3" }} elevation="none" >
                                        <CardBody justify="center" direction="row" align="center" width="100%">
                                            <Box width="10%" height="100%" justify="center" align="center" onClick={() => select(false, false)} style={{ outline: 'none' }} focusIndicator={false}>
                                                <CaretLeftFill size="medium" color="dark-2" />
                                            </Box>
                                            <Box justify="center" align="center" direction="column" width="80%" height="100%" onClick={() => createVote(1)} style={{ outline: 'none' }} focusIndicator={false}>
                                                <Text textAlign="center" size="small">
                                                    가장 {cautionTitle} 자에게 경고를
                                                </Text>
                                            </Box>
                                            <Box width="10%" height="100%" justify="center" align="center" onClick={() => select(false, true)} style={{ outline: 'none' }} focusIndicator={false}>
                                                <CaretRightFill size="medium" color="dark-2" />
                                            </Box>
                                        </CardBody>
                                    </Card>}
                            </Grid>
                        </Box>
                    </Box>
                </Layer>
            )}
            {layer1 === 182 && (
                <Layer plain onClickOutside={() => setLayer1(layer1 ? undefined : 182)} position="center" responsive={false}>
                    <Box
                        align="center"
                        justify="center"
                        gap="medium"
                        pad="medium"
                        background={{ "color": "light-3" }}
                        width={size === 'small' ? '288px' : 'medium'}
                        round="small"
                        elevation="small">
                        <Text textAlign="center" size={size} weight="bold">
                            처벌을 위한 재판
                        </Text>
                        <Text textAlign="center" size={size === 'small' ? 'xsmall' : 'small'}>
                            상대의 잘못을 따져 옳고 그름을 정의합니다
                        </Text>
                        <Box align="baseline" justify="between" overflow="auto" direction="row-responsive" width="100%">
                            <Grid rows={size === 'small' ? 'xsmall' : 'small'} width="100%">
                                {voteToggle ?
                                    <Card flex={false} justify="center" direction="column" align="center" background={{ "color": "status-critical" }} onClick={() => { setLayer2(layer2 ? undefined : 211) }} style={{ outline: 'none' }} focusIndicator={false} elevation="none" >
                                        <CardBody justify="center" direction="row" align="center" width="100%">
                                            <Box width="10%" height="100%" justify="center" align="center">
                                            </Box>
                                            <Box justify="center" align="center" direction="column" width="80%" height="100%">
                                                <Text textAlign="center" size="small">
                                                    부당한 자에 대한 처벌을
                                                </Text>
                                            </Box>
                                            <Box width="10%" height="100%" justify="center" align="center">
                                            </Box>
                                        </CardBody>
                                    </Card> :
                                    <Card flex={false} justify="center" direction="column" align="center" background={{ "color": "dark-3" }} elevation="none" >
                                        <CardBody justify="center" direction="row" align="center" width="100%">
                                            <Box width="10%" height="100%">
                                            </Box>
                                            <Box justify="center" align="center" direction="column" width="80%" height="100%">
                                                <Text textAlign="center" size="small">
                                                    진행 중인 재판이 없습니다
                                                </Text>
                                            </Box>
                                            <Box width="10%" height="100%">
                                            </Box>
                                        </CardBody>
                                    </Card>}
                            </Grid>
                        </Box>
                    </Box>
                </Layer>
            )}
            {layer1 === 267 && (
                <Layer plain onClickOutside={() => setLayer1(layer1 ? undefined : 291)} position="center" responsive={false}>
                    <Box
                        align="center"
                        justify="center"
                        pad="medium"
                        gap="medium"
                        round="small"
                        elevation="small"
                        background={{ "color": "status-error" }}
                        width={size === 'small' ? '288px' : 'medium'}
                        border={{ "color": "active" }}>
                        <Text textAlign="center" size={size} weight="bold">
                            탈퇴
                        </Text>
                        <Text textAlign="center" size={size === 'small' ? 'xsmall' : 'small'}>
                            모임에서 나가시겠습니까?
                        </Text>
                        <Box align="center" justify="center" direction="row" gap="small">
                            <Button label="예" size={size === 'small' ? 'xsmall' : 'small'} color="light-2" onClick={() => withdraw()} />
                            <Button label="아니오" size={size === 'small' ? 'xsmall' : 'small'} color="light-2" primary onClick={() => setLayer1(layer1 ? undefined : 267)} />
                        </Box>
                    </Box>
                </Layer>
            )}
            {layer1 === 244 && (
                <Layer plain onClickOutside={() => setLayer1(layer1 ? undefined : 244)} position="center" responsive={false}>
                    <Box
                        align="center"
                        justify="center"
                        gap="medium"
                        pad="medium"
                        background={{ "color": "light-3" }}
                        width={size === 'small' ? '288px' : 'medium'}
                        round="small"
                        elevation="small">
                        <Text textAlign="center" size={size} weight="bold">
                            신규 입회
                        </Text>
                        <Text textAlign="center" size={size === 'small' ? 'xsmall' : 'small'}>
                            친구를 초대합니다
                        </Text>
                        <TextInput value={inviteUsername} onChange={event => setInviteUsername(event.target.value)} icon={<User size={size} />} placeholder="실명 입력" size={size === 'small' ? 'xsmall' : 'small'} type="text" maxLength="6" focusIndicator={false} />
                        <TextInput value={invitePhoneNumber} onChange={event => setInvitePhoneNumber(event.target.value)} icon={<Phone size={size} />} placeholder="전화번호 입력" size={size === 'small' ? 'xsmall' : 'small'} type="tel" maxLength="11" focusIndicator={false} />
                        <Button label="초대" color="dark-1" size={size === 'small' ? 'xsmall' : 'small'} onClick={() => invite()} disabled={submitToggle} />
                    </Box>
                </Layer>
            )}
            {layer2 === 211 && (
                <Layer modal position="bottom" onClickOutside={() => {
                    if (convictionVote === '유죄') vote('', true);
                    else if (convictionVote === '무죄') vote('', false);
                    setConvictionVote(undefined);
                    setLayer2(layer2 ? undefined : 211);
                }} animate responsive={false}>
                    <Box align="center" justify="center" direction="column" pad="medium" gap="medium" background={{ "color": "dark-1" }} width="medium" height="60vh">
                        <Text textAlign="center" size={size} weight="bold">
                            재판장
                        </Text>
                        <Box align="center" height="100%" width="100%" gap="medium" overflow="auto">
                            <Text size={size === 'small' ? 'xsmall' : 'small'} weight="normal">
                                부당한 메시지의 내용
                            </Text>
                            <Box flex={false} width="100%" pad="small">
                                <Card flex={false} background={{ 'color': 'status-error' }} elevation="none" >
                                    <CardHeader />
                                    <CardBody>
                                        <Box pad="medium">
                                            <Text size="small" weight="normal" style={{ whiteSpace: 'pre-wrap' }}>
                                                {voteConvictionMessage}
                                            </Text>
                                        </Box>
                                    </CardBody>
                                    <CardFooter />
                                </Card>
                            </Box>
                            <Text size={size === 'small' ? 'xsmall' : 'small'} weight="normal">
                                처벌을 바라는 친구의 주장
                            </Text>
                            <Box flex={false} width="100%" pad="small">
                                <Card flex={false} background={{ 'color': 'dark-3' }} elevation="none" >
                                    <CardHeader />
                                    <CardBody>
                                        <Box pad="medium">
                                            <Text size="small" weight="normal" style={{ whiteSpace: 'pre-wrap' }}>
                                                {voteConvictionOpinion}
                                            </Text>
                                        </Box>
                                    </CardBody>
                                    <CardFooter />
                                </Card>
                            </Box>
                        </Box>
                        {voteConvictionUserId === userSelfId ?
                            <></>
                            :
                            <Box align="center" justify="center" width="medium">
                                <RadioButtonGroup options={["보류", "유죄", "무죄"]} direction="row" defaultValue="보류" gap="small" onChange={e => setConvictionVote(e.target.value)} />
                            </Box>}
                        <Box align="center" justify="between" flex={false} direction="row" pad="medium" fill="horizontal" />
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
                    <Button icon={<UserAdd color="dark-1" size={size === 'small' ? '20px' : '22px'} />} type="button" plain onClick={() => setLayer1(layer1 ? undefined : 244)} />
                    <Button icon={<Plan color="dark-1" size={size === 'small' ? '20px' : '22px'} />} type="button" plain onClick={() => push('/post')} />
                    <Button icon={<Inbox color="dark-1" size={size === 'small' ? '20px' : '22px'} />} type="button" plain onClick={() => push('/messagebox')} />
                    <Button icon={<Menu color="dark-1" size={size === 'small' ? '20px' : '22px'} />} type="button" plain onClick={() => push('/main')} />
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
                <Box align="center" justify="center" direction="column" gap="small" pad="small">
                    <Text textAlign="center" size="small">
                        {props.selectedDescription ? props.selectedDescription : ''}
                    </Text>
                </Box>
                <Box align="center" justify="center" direction="row" gap="small" pad="small">
                    <Button size="small" icon={<Close color='dark-1' size={size === 'small' ? '16px' : '22px'} />} plain active={false} onClick={() => setLayer1(layer1 ? undefined : 267)} />
                </Box>
                <Box align="center" justify="center" direction="row">
                    <Box align="center" justify="center" direction={size === 'small' ? 'column' : 'row'} pad="medium" gap="medium">
                        <Trophy size={size === 'small' ? '20px' : '30px'} color="dark-1" />
                        <Button label="축복" primary size={size === 'small' ? 'xsmall' : 'small'} badge={prizeVotes} onClick={() => findVote('PRIZE', 155)} />
                    </Box>
                    <Box align="center" justify="center" direction={size === 'small' ? 'column' : 'row'} pad="medium" gap="medium">
                        <Trigger size={size === 'small' ? '20px' : '30px'} color="dark-1" />
                        <Button label="각성" primary size={size === 'small' ? 'xsmall' : 'small'} badge={cautionVotes} onClick={() => findVote('CAUTION', 169)} />
                    </Box>
                    <Box align="center" justify="center" direction={size === 'small' ? 'column' : 'row'} pad="medium" gap="medium">
                        <Tools size={size === 'small' ? '20px' : '30px'} color="dark-1" />
                        <Button label="처벌" primary size={size === 'small' ? 'xsmall' : 'small'} badge={convictionVotes} onClick={() => findVote('CONVICTION', 182)} />
                    </Box>
                </Box>
            </Box>
            <Box align="baseline" justify="between" overflow="auto" direction="row-responsive" width="100%" pad="medium">
                <Grid rows="xsmall" width="100%" pad="small" columns={{ "size": "xsmall", "count": "fit" }} gap="small">
                    {userStatus ?
                        users.map((user, key) => {
                            return (
                                <Card key={key} background={{ "color": user.isSelf ? "dark-1" : "dark-2" }} onClick={() => user.isSelf ? {} : preset(user.id, user.username)} focusIndicator={false} style={{ outline: 'none' }} elevation="xsmall" >
                                    <CardHeader pad="small" flex={false} />
                                    <CardBody pad="small" direction="column" justify="center" align="center">
                                        <Text textAlign="center" size="xsmall" weight="bold">
                                            {user.username}
                                        </Text>
                                    </CardBody>
                                    <CardFooter align="center" justify="center" flex={false} pad="small">
                                        {user.isSelf ? <Radial size="small" color="light-2" /> : <Send size="small" color="dark-1" />}
                                    </CardFooter>
                                </Card>)
                        }) :
                        <Box align="center" justify="center">
                            <Spinner color="dark-1" />
                        </Box>
                    }
                </Grid>
            </Box>
            <Box align="center" justify="between" flex={false} direction="row" pad="medium" fill="horizontal" />
        </Box>
    )
}

export default Gathering;