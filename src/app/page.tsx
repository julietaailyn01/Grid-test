"use client";
import { Box, Button, Fade, SimpleGrid, VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [grid, setGrid] = useState<number>(0);
  const [cellSize, setCellSize] = useState<number>(0);
  const [paintedCells, setPaintedCells] = useState(new Map<number, string>());
  const [selectedColor, setSelectedColor] = useState("blue.500");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ x: 0, y: 0 });
  const isPainting = useRef(false);
  const colors = [
    "red.500",
    "blue.500",
    "green.500",
    "yellow.500",
    "purple.500",
  ];

  useEffect(() => {
    const updateGrid = () => {
      if (typeof window === "undefined") return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const cellSize = Math.floor(width / 100);
      const rows = Math.floor(height / cellSize);
      setGrid(rows * 100);
      setCellSize(cellSize);
    };

    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  const handleClick = (index: number) => {
    setPaintedCells((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(index)) {
        newMap.delete(index);
      } else {
        newMap.set(index, selectedColor);
      }
      return newMap;
    });
  };

  const handleRightClick = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    setPickerPosition({ x: event.clientX, y: event.clientY });
    setShowColorPicker(true);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setShowColorPicker(false);
  };

  return (
    <Box
      width="100vw"
      h="100vh"
      userSelect="none"
      onMouseDown={() => (isPainting.current = true)}
      onMouseUp={() => (isPainting.current = false)}
      onMouseLeave={() => (isPainting.current = false)}
    >
      {grid !== null && cellSize !== null && (
        <SimpleGrid columns={100}>
          {Array.from({ length: grid }).map((_, index) => (
            <Box
              key={index}
              width={`${cellSize}px`}
              h={`${cellSize}px`}
              bg={paintedCells.get(index) || "gray.100"}
              border="1px solid #ccc"
              onClick={() => handleClick(index)}
              onContextMenu={(e) => handleRightClick(e, index)}
              onMouseEnter={() => isPainting.current && handleClick(index)}
            />
          ))}
        </SimpleGrid>
      )}

      {showColorPicker && (
        <Fade in={showColorPicker}>
          <VStack
            position="absolute"
            left={`${pickerPosition.x}px`}
            top={`${pickerPosition.y}`}
            bg="white"
            p={3}
            boxShadow="lg"
            onMouseLeave={() => {
              setShowColorPicker(false);
            }}
          >
            {colors.map((color) => (
              <Button
                key={color}
                bg={color}
                width={"40px"}
                height={"40px"}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </VStack>
        </Fade>
      )}
    </Box>
  );
}
