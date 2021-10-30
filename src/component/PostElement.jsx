import React, { useState, useEffect, useContext } from 'react';
import { Box, Text, Button, Card, CardHeader, CardBody, CardFooter, ResponsiveContext, Spinner, Collapsible } from 'grommet';
import { User, Edit, Chat } from 'grommet-icons';
import { apiCall } from '../common';

const PostElement = (props) => {
  const size = useContext(ResponsiveContext);

  const [collapseStatus, setCollapseStatus] = useState(false);
  const [commentStatus, setCommentStatus] = useState(2);

  const [comments, setComments] = useState([]);

  const findPostComments = async () => {
    setCommentStatus(2);

    const response = await apiCall('GET', `/post/comments/${props.post.id}?lang=ko`, null, props.push);

    if (response) {
      if (response.success) {
        const data = response.data;
        if (data) {
          if (data.length > 0) {
            setComments(data);
            setCommentStatus(0);
          }
          else {
            setCommentStatus(1);
          }
        }
        else {
          setCommentStatus(1);
        }
      }
      else {
        setCommentStatus(1);
      }
    }
    else {
      setCommentStatus(1);
    }
  };

  useEffect(() => {
    if (collapseStatus)
      findPostComments();
  }, [collapseStatus])

  useEffect(() => {
    if (props.post.id === props.selectedPostId)
      findPostComments();
  }, [props.commentToggle]);

  return (
    <Card background={{ color: 'light-3' }} style={{ outline: 'none' }} flex={false} elevation="xsmall">
      <CardHeader pad="medium" gap="small" focusIndicator={false} onClick={() => setCollapseStatus(!collapseStatus)} >
        <Box align="center" justify="left" direction="row" gap="medium">
          <Chat size={size === 'small' ? '16px' : '18px'} color="dark-4" />
          <Text size="small" weight="bold" color="dark-1">{props.post.title}</Text>
        </Box>
      </CardHeader>
      <Collapsible open={collapseStatus}>
        <CardBody focusIndicator={false}>
          <Box pad="medium">
            <Text size="small" weight="normal" style={{ whiteSpace: 'pre-wrap' }} color="dark-1">
              {props.post.content}
            </Text>
          </Box>
        </CardBody>
        <CardFooter direction="column" align="left" justify="center" pad="medium" gap="small" >
          {commentStatus === 0 ?
            comments.map((comment, key) => {
              return (
                <Box key={key} direction="row" align="center" gap="medium">
                  <User size={size === 'small' ? '16px' : '18px'} color="dark-4" />
                  <Text size="small">{comment.content}</Text>
                </Box>
              )
            }) :
            commentStatus === 1 ?
              <></> :
              <Box align="center" justify="center">
                <Spinner color="dark-1" />
              </Box>
          }
          <Box pad="small" />
          <Box direction="row" fill="horizontal" align="center" justify="end" gap="small">
            <Button size="xsmall" plain icon={<Edit size={size === 'small' ? '16px' : '18px'} />} onClick={() => { props.setSelectedPostId(props.post.id); props.setLayer(130); setCollapseStatus(true) }} />
          </Box>
        </CardFooter>
      </Collapsible>
    </Card>
  )
}

export default React.memo(PostElement);