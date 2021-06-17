toInput = "100\n3 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8".split("\n")
input = lambda: toInput.pop(0)

shapeCount = int(input())
shapes = [*map(int, input().split(" "))]

def dfs(boxSides, depth):
    shapeSides = shapes[depth]

    # Check shape can warp whole box
    if depth == shapeCount-1 and boxSides == shapeSides:
        print("Y")
        quit()
    
    for i in range(-shapeSides, shapeSides):
        # Go to the next depth
        if boxSides > i and depth+1 < shapeCount:
            dfs(boxSides-i, depth+1)

dfs(4, 0)

print("X")