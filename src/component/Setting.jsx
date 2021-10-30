import React, { useState, useEffect, useContext } from 'react';
import { Box, Layer, Text, Button, Nav, ResponsiveContext } from 'grommet';
import { Logout, Menu, Close, Trophy, Trigger, Tools } from 'grommet-icons';
import { emptyString, ratingTitles } from '../constant';
import { apiCall, deleteCookie } from '../common';

const Setting = (props) => {
    const { push } = useContext(props.RouterContext);
    const size = useContext(ResponsiveContext);

    const [layer, setLayer] = useState();

    const [username, setUsername] = useState(emptyString);
    const [rating, setRating] = useState(1000);
    const [prize, setPrize] = useState(0);
    const [caution, setCaution] = useState(0);
    const [conviction, setConviction] = useState(0);
    
    const [title, setTitle] = useState(ratingTitles[2]);

    const load = async () => {
        const response = await apiCall('GET', `/user?lang=ko`, null, push);

        if (response && response.success) {
            setUsername(response.data.username);
            setRating(response.data.rating);
            setPrize(response.data.prize);
            setCaution(response.data.caution);
            setConviction(response.data.conviction);
        }
    };

    const withdraw = async () => {
        const response = await apiCall('DELETE', `/user?lang=ko`, null, push);

        if (response && response.success) {
            deleteCookie('MONASTERYTOKEN');
            setLayer(undefined);
            push('/signin');
        }
    };

    useEffect(() => load(), []);

    useEffect(() => {
        if (rating === 0)
            setTitle(ratingTitles[4]);
        else if (rating < 800)
            setTitle(ratingTitles[3])
        else if (rating < 1200)
            setTitle(ratingTitles[2]);
        else if (rating < 2000)
            setTitle(ratingTitles[1]);
        else if (rating === 2000)
            setTitle(ratingTitles[0]);
    }, [rating]);

    return (
        <Box fill="vertical" overflow="auto" align="center" flex="grow" direction="column" justify="start" background={{ "color": "light-2" }} animation="fadeIn">
            {layer === 291 && (
                <Layer plain onClickOutside={() => setLayer(layer ? undefined : 291)} position="center" responsive={false}>
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
                            삭제
                        </Text>
                        <Text textAlign="center" size={size === 'small' ? 'xsmall' : 'small'}>
                            계정을 삭제하시겠습니까?
                        </Text>
                        <Box align="center" justify="center" direction="row" gap="small">
                            <Button label="예" size={size === 'small' ? 'xsmall' : 'small'} color="light-2" onClick={() => withdraw()} />
                            <Button label="아니오" size={size === 'small' ? 'xsmall' : 'small'} color="light-2" primary onClick={() => setLayer(layer ? undefined : 291)} />
                        </Box>
                    </Box>
                </Layer>
            )}
            {layer === 335 && (
                <Layer plain onClickOutside={() => setLayer(layer ? undefined : 335)} position="center" responsive={false}>
                    <Box
                        align="center"
                        justify="center"
                        pad="medium"
                        gap="medium"
                        round="small"
                        elevation="small"
                        background={{ "color": "dark-1" }}
                        width={size === 'small' ? '288px' : 'medium'}
                        border={{ "color": "active" }}>
                        <Text textAlign="center" size={size} weight="bold">
                            로그아웃
                        </Text>
                        <Text textAlign="center" size={size === 'small' ? 'xsmall' : 'small'}>
                            로그아웃 하시겠습니까?
                        </Text>
                        <Box align="center" justify="center" direction="row" gap="small">
                            <Button label="예" size={size === 'small' ? 'xsmall' : 'small'} color="light-2" onClick={() => { deleteCookie('MONASTERYTOKEN'); setLayer(layer ? undefined : 335); push('/signin'); }} />
                            <Button label="아니오" size={size === 'small' ? 'xsmall' : 'small'} color="light-2" primary onClick={() => setLayer(layer ? undefined : 335)} />
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
                    <Button plain icon={<Menu size={size === 'small' ? '20px' : '22px'} color="dark-1" />} type="button" onClick={() => push('/main')} />
                    <Button icon={<Logout size={size === 'small' ? '20px' : '22px'} color="dark-1" />} type="button" plain onClick={() => setLayer(layer ? undefined : 335)} />
                </Nav>
            </Box>
            <Box align="center" justify="center" direction="column" pad="medium" flex={false} fill="horizontal" gap="medium">
                <Box align="center" justify="center" direction="column" gap="small">
                    <Text textAlign="center" size={size} weight={rating === 0 || rating === 2000 ? "bold" : "normal"}>
                        {title}
                    </Text>
                    <Text textAlign="center" weight="bold" size={size === 'small' ? 'medium' : 'large'}>
                        {username}
                    </Text>
                </Box>
                <Box align="center" justify="center" direction="column" gap="small" pad="small">
                    <Text textAlign="center" size="small" weight="normal">
                        {rating} / 2000
                    </Text>
                </Box>
                <Box align="center" justify="center" direction="column" gap="small" pad="small">
                    <Button size="small" icon={<Close color='dark-1' size={size === 'small' ? '16px' : '22px'} />} plain active={false} onClick={() => setLayer(layer ? undefined : 291)} />
                </Box>
                <Box align="center" justify="center" direction="row" gap="small">
                    <Box align="center" justify="center" direction="column" pad="medium" gap="small">
                        <Trophy size={size === 'small' ? '20px' : '30px'} color="dark-1" />
                        <Text size={size === 'small' ? 'xsmall' : 'small'} textAlign="center" color="dark-1">
                            {prize}
                        </Text>
                    </Box>
                    <Box align="center" justify="center" direction="column" pad="medium" gap="small">
                        <Trigger size={size === 'small' ? '20px' : '30px'} color="dark-1" />
                        <Text size={size === 'small' ? 'xsmall' : 'small'} textAlign="center" color="dark-1">
                            {caution}
                        </Text>
                    </Box>
                    <Box align="center" justify="center" direction="column" pad="medium" gap="small">
                        <Tools size={size === 'small' ? '20px' : '30px'} color="dark-1" />
                        <Text size={size === 'small' ? 'xsmall' : 'small'} textAlign="center" color="dark-1">
                            {conviction}
                        </Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Setting;