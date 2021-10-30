import React, { useState, useEffect, useContext } from 'react';
import { Box, Layer, Text, TextInput, Button, Nav, Grid, Card, CardBody, ResponsiveContext, Spinner } from 'grommet';
import { Book, Script, Add, Configure, Group, Catalog, MailOption, Refresh } from 'grommet-icons';
import { apiCall } from '../common';

const Main = (props) => {
    const { push } = useContext(props.RouterContext);
    const size = useContext(ResponsiveContext);

    const [layer, setLayer] = useState();
    const [submitToggle, setSubmitToggle] = useState(false);

    const [gatheringStatus, setGatheringStatus] = useState(2);
    const [gatherings, setGatherings] = useState([]);

    const [gatheringName, setGatheringName] = useState();
    const [gatheringDescription, setGatheringDescription] = useState();

    const confirm = () => gatheringName === undefined || gatheringName === '';

    const refresh = async () => {
        setGatheringStatus(2);
        setGatherings([]);

        const response = await apiCall('GET', `/gatherings?lang=ko`, null, push);

        if (response) {
            if (response.success) {
                const data = response.data;
                if (data) {
                    if (data.length > 0) {
                        setGatherings(data);
                        setGatheringStatus(0);
                    }
                    else {
                        setGatheringStatus(1);
                    }
                }
            }
            else {
                setGatheringStatus(1);
            }
        }
        else {
            setGatheringStatus(1);
        }
    };

    const create = async () => {
        setLayer(undefined);
        setGatheringName(undefined);
        setGatheringDescription(undefined);

        const response = await apiCall(
            'POST', 
            `/gathering?lang=ko`,
            { gatheringName: gatheringName, description: gatheringDescription },
            push
        );

        if (response && response.success)
            refresh();
    };

    const enter = (id, name, description, prize, caution, conviction) => {
        props.setSelectedGatheringId(id);
        props.setSelectedGatheringName(name);
        props.setSelectedDescription(description);
        props.setSelectedPrizeVotes(prize);
        props.setSelectedCautionVotes(caution);
        props.setSelectedConvictionVotes(conviction);
        push('/gathering');
    }

    useEffect(() => refresh(), []);

    useEffect(() => {
        setSubmitToggle(confirm(gatheringName));
    }, [gatheringName]);

    return (
        <Box align="center" justify="start" overflow="auto" flex="grow" fill="vertical" direction="column" background={{ "color": "light-2" }} animation="fadeIn">
            {layer === 27 && (
                <Layer plain position="center" onClickOutside={() => setLayer(layer ? undefined : 27)} responsive={false}>
                    <Box
                        align="center"
                        justify="center"
                        gap="medium"
                        pad="medium"
                        background={{ "color": "dark-2" }}
                        border={{ "color": "active" }}
                        width={size === 'small' ? '288px' : 'medium'}
                        round="small"
                        elevation="small">
                        <Text textAlign="center" size={size} weight="bold">
                            수도회 설립
                        </Text>
                        <Text size={size === 'small' ? 'xsmall' : 'small'}>
                            모임을 생성합니다
                        </Text>
                        <TextInput value={gatheringName} onChange={event => setGatheringName(event.target.value)} icon={<Book size={size} color="light-2" />} placeholder="이름 입력" size={size === 'small' ? 'xsmall' : 'small'} type="text" maxLength="16" focusIndicator={false} />
                        <TextInput value={gatheringDescription} onChange={event => setGatheringDescription(event.target.value)} icon={<Script size={size} color="light-2" />} placeholder="설명 입력" size={size === 'small' ? 'xsmall' : 'small'} type="text" maxLength="32" focusIndicator={false} />
                        <Button color="light-2" label="완료" size={size === 'small' ? 'xsmall' : 'small'} onClick={() => create()} disabled={submitToggle} />
                    </Box>
                </Layer>
            )}
            <Box align="center" justify="between" flex={false} direction="row" pad="medium" fill="horizontal">
                <Box align="center" justify="center" direction="row" pad="small">
                    <Text textAlign="center" color="dark-1" size={size === 'small' ? 'medium' : 'large'} style={{ fontFamily: 'Pacifico' }}>
                        Cloist.
                    </Text>
                </Box>
                <Nav align="center" flex={false} direction="row" pad="small" gap={size === 'small' ? '20px' : '22px'} justify="center">
                    <Button plain icon={<Add size={size === 'small' ? '20px' : '22px'} color="dark-1" />} type="button" onClick={() => setLayer(27)} />
                    <Button plain icon={<Configure size={size === 'small' ? '20px' : '22px'} color="dark-1" />} type="button" onClick={() => push('/setting')} />
                    <Button icon={<Refresh size={size === 'small' ? '20px' : '22px'} color="dark-1" />} type="button" plain onClick={() => refresh()} />
                </Nav>
            </Box>
            <Box align="baseline" justify="between" overflow="auto" direction="row-responsive" responsive width="100%" pad="medium">
                <Grid rows={size === 'small' ? 'xsmall' : 'small'} columns={{ "size": size === 'small' ? 'small' : '288px', "count": "fit" }} pad="small" gap="small" width="100%">
                    {gatheringStatus === 0 ?
                        gatherings.map((gathering, key) => {
                            return (
                                <Card key={key} flex={false} align="stretch" direction="column" justify="center" background={{ "color": "dark-1" }} elevation="xsmall" onClick={() => enter(gathering.id, gathering.gatheringName, gathering.description, gathering.prizeVotes, gathering.cautionVotes, gathering.convictionVotes)} >
                                    <CardBody justify="center" direction="row" align="center">
                                        <Box width="8%" height="100%" background={size === 'small' ? 'brand' : 'dark-1'} />
                                        <Box justify="center" align="center" direction="column" pad="small" width="84%" height="100%">
                                            <Text textAlign="center" size="small" weight="bold" margin="xsmall">
                                                {gathering.gatheringName}
                                            </Text>
                                            <Text textAlign="center" size="xsmall" weight="normal">
                                                수도회
                                            </Text>
                                            <Box justify="center" align="center" pad="small" gap={size === 'small' ? 'small' : 'xsmall'} direction="row">
                                                <Group size="small" />
                                                <Text textAlign="center" size="xsmall">
                                                    {gathering.userCount}
                                                </Text>
                                                <Catalog size="small" />
                                                <Text textAlign="center" size="xsmall">
                                                    {gathering.prizeVotes + gathering.cautionVotes + gathering.convictionVotes}
                                                </Text>
                                                <MailOption size="small" />
                                                <Text textAlign="center" size="xsmall">
                                                    {gathering.messageCount}
                                                </Text>
                                            </Box>
                                        </Box>
                                        <Box width="8%" height="100%" />
                                    </CardBody>
                                </Card>
                            )
                        }) :
                        gatheringStatus === 1 ?
                            <Box align="center" justify="center">
                                <Text size={size === 'small' ? 'xsmall' : 'small'} color="dark-4">
                                    당신은 어느 모임에도 속하지 않았습니다
                                </Text>
                            </Box> :
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

export default Main;