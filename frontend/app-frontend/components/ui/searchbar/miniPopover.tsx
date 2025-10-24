import {
  Stack, IconButton,Popover, Checkbox,
  Menu, Button, Portal, Field, HStack,
  Text, Code
} from "@chakra-ui/react"
import { useColorModeValue } from "../color-mode";
import { useState, useEffect, useRef } from "react";
import { MdSelectAll } from "react-icons/md";
import { MdDeselect } from "react-icons/md";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

type option = {
    label : string;
    value : string;
}

interface miniPopoverProps {
    clickEvent : (value : string[]) => void;
    iconTextColor : string;
    options : option[];
    label : string;
}

export default function MiniPopover(props : miniPopoverProps){
    // Form schema: an array of booleans
    const formSchema = z.object({
    checkboxes: z.array(z.boolean()).length(props.options.length),
    })

    type FormData = z.infer<typeof formSchema>

    const form = useForm<FormData>({
        resolver: standardSchemaResolver(formSchema),
        defaultValues: {
        checkboxes: Array(props.options.length).fill(false),
        },
    })

    const { control, handleSubmit, setValue, watch } = form
    const values = watch("checkboxes")
    const prevOptionsLength = useRef(props.options.length);

    useEffect(() => {
        if (props.options.length !== prevOptionsLength.current) {
            form.reset({
            checkboxes: Array(props.options.length).fill(false),
            });
            prevOptionsLength.current = props.options.length;
        }
        const subscription = form.watch((value, { name }) => {
            if (name?.startsWith("checkboxes")) {
            const checkboxes = form.getValues("checkboxes")

            const selectedValues = props.options
                .filter((_, i) => checkboxes[i])
                .map((opt) => opt.value)

            props.clickEvent?.(selectedValues)
            }
        },)

        return () => subscription.unsubscribe()
    }, [form, props.options, props.clickEvent])

    // toggle all checkboxes: if all are checked, uncheck all; else check all
    const toggleAll = () => {
        const allChecked = values.every((v) => v === true)
        setValue("checkboxes", values.map(() => !allChecked), {
        shouldValidate: true,
        })
    }

    const allChecked = values.every((v) => v === true)

    return (
    <Popover.Root positioning={{ placement: "left" }}>
        <Popover.Trigger asChild>
        <Button 
        variant="solid" 
        color="white" 
        bg={useColorModeValue("#9AB3F2", '#335098')}
        _hover={{bg : useColorModeValue("#8ba2dbff", '#3d5eb2ff')}}
        >{props.label}</Button>
        </Popover.Trigger>
        <Popover.Positioner>
        <Popover.Content>
            <Popover.CloseTrigger />
            <Popover.Arrow>
            <Popover.ArrowTip />
            </Popover.Arrow>
            <Popover.Body p={3}>
            
             <form onSubmit={handleSubmit((data) => console.log(data))} >
                <Stack align="flex-start" gap={4} color={props.iconTextColor}>
                    <Button w="100%" variant="outline" onClick={toggleAll}>
                         {!allChecked ? (<><MdSelectAll /> Select All</>) : (<><MdDeselect />Deselect All</>)}
                    </Button>
                    {/* list of checkboxes */}
                    {values.map((value, index) => (
                    <Controller
                        key={index}
                        name={`checkboxes.${index}`}
                        control={control}
                        render={({ field }) => (
                        <Field.Root>
                            <Checkbox.Root
                            checked={field.value}
                            onCheckedChange={({ checked }) => {
                                field.onChange(checked)
                            }}
                            >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label>{props.options[index].label}</Checkbox.Label>
                            </Checkbox.Root>
                        </Field.Root>
                        )}
                    />
                    ))}
                </Stack>
            </form>
            </Popover.Body>
        </Popover.Content>
        </Popover.Positioner>
    </Popover.Root>);
}