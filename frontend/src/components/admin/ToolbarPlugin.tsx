import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND
} from 'lexical';
import {mergeRegister} from '@lexical/utils';
import {Divider, IconButton, Toolbar, Tooltip} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import CodeIcon from '@mui/icons-material/Code';

const LowPriority = 1;

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isCodeBlock, setIsCodeBlock] = useState(false);

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
        }

        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const parentNode = selection.anchor.getNode().getParent();
                setIsCodeBlock(parentNode && parentNode.getType() === 'code');
            }
        });
    }, [editor]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _newEditor) => {
                    $updateToolbar();
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority
            )
        );
    }, [editor, $updateToolbar]);

    const toggleCodeBlock = () => {
        editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                      const parentNode = selection.anchor.getNode().getParent();
                      if (parentNode && parentNode.getType() === 'code') {
                            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'paragraph');
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, null);
                          } else {
                            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'code');
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
                          }
                    }
              });
    };

    return (
        <Toolbar ref={toolbarRef} variant="dense" sx={{ padding: '4px' }}>
            <Tooltip title="Undo">
                <span>
                    <IconButton
                        disabled={!canUndo}
                        onClick={() => {
                            editor.dispatchCommand(UNDO_COMMAND, undefined);
                        }}
                    >
                        <UndoIcon />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Redo">
                <span>
                    <IconButton
                        disabled={!canRedo}
                        onClick={() => {
                            editor.dispatchCommand(REDO_COMMAND, undefined);
                        }}
                    >
                        <RedoIcon />
                    </IconButton>
                </span>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ margin: '0 8px' }} />
            <Tooltip title="Bold">
                <IconButton
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                    }}
                    color={isBold ? 'primary' : 'default'}
                >
                    <FormatBoldIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Italic">
                <IconButton
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                    }}
                    color={isItalic ? 'primary' : 'default'}
                >
                    <FormatItalicIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Underline">
                <IconButton
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                    }}
                    color={isUnderline ? 'primary' : 'default'}
                >
                    <FormatUnderlinedIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Strikethrough">
                <IconButton
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                    }}
                    color={isStrikethrough ? 'primary' : 'default'}
                >
                    <StrikethroughSIcon />
                </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ margin: '0 8px' }} />
            <Tooltip title="Align Left">
                <IconButton
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
                    }}
                >
                    <FormatAlignLeftIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Align Center">
                <IconButton
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
                    }}
                >
                    <FormatAlignCenterIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Align Right">
                <IconButton
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
                    }}
                >
                    <FormatAlignRightIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Justify">
                <IconButton
                    onClick={() => {
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
                    }}
                >
                    <FormatAlignJustifyIcon />
                </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ margin: '0 8px' }} />
            <Tooltip title="Code Block">
                <IconButton
                    onClick={toggleCodeBlock}
                    color={isCodeBlock ? 'primary' : 'default'}
                >
                    <CodeIcon />
                </IconButton>
            </Tooltip>
        </Toolbar>
    );
}
