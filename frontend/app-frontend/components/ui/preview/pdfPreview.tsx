'use client';

import { Box, Center, Flex, HStack } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';

interface PDFProps {
    src: string|null;
}

export default function PDFViewer (props:PDFProps) {
    // const [url, setURL] = useState<string | null>(null);

    // useEffect (() => {
    //     const pdfurl = URL.createObjectURL(props.src);
    //     setURL(pdfurl);
    // }, [])

    return (
        <Box
        w={'full'}
        h={'full'}
        overflow={'hidden'}
        >
            {props.src && (
                <iframe 
                src={props.src}
                width="100%"
                height="100%"
                title="Document Preview"
                style={{ border: 'none' }}
                />
            )}
        </Box>
    );
};