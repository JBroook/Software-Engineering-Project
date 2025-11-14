import React, { useEffect, useState } from 'react'
import { Box, Flex, Input, Stack, Text
} from '@chakra-ui/react'
import Searchbar from '../searchbar/searchbar';
import { FileTag } from '../viewType/interfaces';
import { TagType } from '../viewType/interfaces';

type TagSearchbarProps = {
  inputEvent : (value : string)=>Promise<any>;
  addTagEvent : (tagType : TagType) => void;
}

export default function TagSearchbar(props : TagSearchbarProps) {
  const [focus, setFocus] = useState<boolean>(false);
  const [availableTags, setAvailableTags] = useState<TagType[]>([]);

  const searchAndShow = async (input : string) => {
    const data = await props.inputEvent(input);
    setAvailableTags(data);
  };

  const selectNewTag = (tagType : TagType) => {
    props.addTagEvent(tagType);
  };

  const availableTagsComponents = availableTags.map((tag : TagType)=>{
    return (
    <Box
    key={tag.id}
    pl={2}
    py={2}
    w="100%"
    cursor="pointer"
    _hover={{bg : tag.color}}
    onMouseDown={()=>selectNewTag(tag)}>
      <Text>
        {tag.name}
      </Text>
    </Box>
    );
  })

  useEffect(()=>{
    searchAndShow("");
  }, [])

  return (<>
    <Input 
        type="text"
        placeholder="Add tags"
        pl={2}
        mt={2}
        color="white"
        _placeholder={{ color: "gray"}}
        onFocus={()=>setFocus(true)}
        onBlur={()=>setFocus(false)}
        onChange={(event) => searchAndShow(event.target.value)}
    />

    {focus && <Box position="relative" zIndex="3">
      <Stack w="100%" bg="gray" position="absolute" zIndex="3" gap="0" p={1} maxH="150px" overflowY="scroll">
        {availableTagsComponents}
      </Stack>
    </Box>}
  </>);
}