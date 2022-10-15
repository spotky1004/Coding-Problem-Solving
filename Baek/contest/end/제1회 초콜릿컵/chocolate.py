from sys import argv, stdin, stderr

def i64(n):
    bytes_ = n.to_bytes(16, byteorder='little', signed=True)
    return int.from_bytes(bytes_[:8], byteorder='little', signed=True)

# cmd: func(prog) modifies stack, dp, cc, input_idx
# frontiers[dp][cc]: next position (r,c) or None
class Area(object):
    def __init__(self, cmd=' ', frontiers=None):
        self.cmd = cmd
        self.frontiers = frontiers or [[None]*2 for _ in range(4)]
    def __repr__(self):
        return f'Area(cmd={self.cmd}, frontiers={self.frontiers})'

class Prog(object):
    def __init__(self, code, input_data):
        self.raw_code = code
        self.code = process(code)
        self.r = 0
        self.c = 0
        self.input_data = input_data
        self.input_idx = 0
        self.output = ''
        self.stack = []
        self.dp = 0
        self.cc = 0
        self.terminated = False
        self.r_sum = 0
    def step(self):
        area = self.code[self.r][self.c]
        area.cmd(self)
        if debug: stderr.write(f'cmd: {self.raw_code[self.r][self.c]} stk: {self.stack}\n')
        for i in range(8):
            if area.frontiers[self.dp][self.cc] is None:
                if i % 2 == 1: self.dp = (self.dp + 1) % 4
                else: self.cc = (self.cc + 1) % 2
                continue
            self.r, self.c = area.frontiers[self.dp][self.cc]
            break
        else:
            self.terminated = True
    def interpret(self, limit = None, r_limit = None):
        steps = 0
        while (limit is None or steps < limit) and (r_limit is None or self.r_sum <= r_limit):
            self.step()
            if self.terminated: break
            steps += 1
        else:
            if limit is not None and steps >= limit: stderr.write(f'Program not finished in {limit} steps\n')
            else: stderr.write(f'r command costs exceeded limit of {r_limit}\n')
            exit(1)
        stderr.write(f'steps: {steps} r_sum: {self.r_sum}\n')
        return self.output

def take_input(prog):
    try: c = prog.input_data[prog.input_idx]; prog.stack.append(ord(c)); prog.input_idx += 1
    except: pass
def do_output(prog):
    try: c = prog.stack.pop(); prog.output += chr(c % 256); debug and stderr.write(f'printing charcode {c%256}\n')
    except: pass
def push_const(p):
    def _push_const(prog): prog.stack.append(i64(p))
    return _push_const
def pop_discard(prog):
    try: prog.stack.pop()
    except: pass
def binop(f):
    def _binop(prog):
        try:
            x = prog.stack.pop()
            try:
                y = prog.stack.pop()
                try: prog.stack.append(i64(f(x, y)))
                except: prog.stack += [y,x]
            except: prog.stack.append(x)
        except: pass
    return _binop
add = binop(lambda x, y: y + x)
sub = binop(lambda x, y: y - x)
mul = binop(lambda x, y: y * x)
div = binop(lambda x, y: y // x)
rem = binop(lambda x, y: y % x)
gt = binop(lambda x, y: int(y > x))
def unnot(prog):
    try: x = prog.stack.pop(); prog.stack.append(int(x == 0))
    except: pass
def add_dp(prog):
    try: x = prog.stack.pop(); prog.dp = (prog.dp + x) % 4
    except: pass
def add_cc(prog):
    try: x = prog.stack.pop(); prog.cc = (prog.cc + x) % 2
    except: pass
def dup(prog):
    try: x = prog.stack.pop(); prog.stack += [x,x]
    except: pass
def roll(prog):
    try:
        x = prog.stack.pop()
        try:
            y = prog.stack.pop()
            if y <= 0 or y > len(prog.stack): prog.stack += [y,x]; return
            to_roll = prog.stack[-y:]
            x = x % y
            rolled = to_roll[-x:] + to_roll[:-x]
            prog.stack[-y:] = rolled
            prog.r_sum += y
            if debug: stderr.write(f'r cost: {prog.r_sum}\n')
        except: prog.stack.append(x)
    except: pass

cmd_table = {
    'I': take_input, 'O': do_output, 'P': push_const, 'p': pop_discard,
    '+': add, '-': sub, '*': mul, '/': div, '%': rem, '!': unnot, '>': gt,
    'D': add_dp, 'C': add_cc, 'd': dup, 'r': roll
}

def undefined_cmd(c, r0, c0):
    def _undefined_cmd(prog):
        stderr.write(f'Unexpected char `{c}` at row {r0}, col {c0}\n')
        exit(1)
    return _undefined_cmd

def process(code):
    rows, cols = len(code), len(code[0])
    processed = [[Area() for _ in range(cols)] for _ in range(rows)]
    for r0 in range(rows):
        for c0 in range(cols):
            cur_cmd = code[r0][c0]
            if cur_cmd == ' ': continue
            cur_area = processed[r0][c0]
            if ' ' != cur_area.cmd: continue
            cur_area.cmd = cur_cmd
            for dp in range(4):
                for cc in range(2):
                    cur_area.frontiers[dp][cc] = (r0, c0)
            stack = [(r0, c0)]
            p = 0
            while stack:
                r, c = stack.pop()
                processed[r][c] = cur_area
                p += 1
                cmpfns = [
                    [lambda r,c:(c,-r), lambda r,c:(c,r)],
                    [lambda r,c:(r,c), lambda r,c:(r,-c)],
                    [lambda r,c:(-c,r), lambda r,c:(-c,-r)],
                    [lambda r,c:(-r,-c), lambda r,c:(-r,c)],
                ]
                for dp in range(4):
                    for cc in range(2):
                        if cmpfns[dp][cc](*cur_area.frontiers[dp][cc]) < cmpfns[dp][cc](r,c): cur_area.frontiers[dp][cc] = (r,c)
                if r > 0 and code[r-1][c] == cur_cmd and ' ' == processed[r-1][c].cmd: processed[r-1][c] = cur_area; stack.append((r-1, c))
                if r < rows-1 and code[r+1][c] == cur_cmd and ' ' == processed[r+1][c].cmd: processed[r+1][c] = cur_area; stack.append((r+1, c))
                if c > 0 and code[r][c-1] == cur_cmd and ' ' == processed[r][c-1].cmd: processed[r][c-1] = cur_area; stack.append((r, c-1))
                if c < cols-1 and code[r][c+1] == cur_cmd and ' ' == processed[r][c+1].cmd: processed[r][c+1] = cur_area; stack.append((r, c+1))
            step = [(0, 1), (1, 0), (0, -1), (-1, 0)]
            for dp in range(4):
                rstep, cstep = step[dp]
                for cc in range(2):
                    frontr, frontc = cur_area.frontiers[dp][cc]
                    nextr, nextc = frontr + rstep, frontc + cstep
                    if nextr in range(rows) and nextc in range(cols) and code[nextr][nextc] != ' ':
                        cur_area.frontiers[dp][cc] = (nextr, nextc)
                    else: cur_area.frontiers[dp][cc] = None
            cur_area.cmd = cmd_table[cur_cmd](p) if cur_cmd == 'P' else cmd_table.get(cur_cmd, undefined_cmd(cur_cmd, r0, c0))
    return processed

def main():
    code = open(argv[1]).read().splitlines()
    rows = len(code)
    if rows == 0: code.append(' '); rows = 1
    cols = max(len(row) for row in code)
    if rows * cols > 1000000:
        stderr.write('rows * cols > 1000000\n')
        exit(1)
    for r in range(rows):
        code[r] = code[r].ljust(cols)
    if code[0] and code[0][0] != ' ': print(Prog(code, stdin.read()).interpret(1000000, 1000000), end='')
    else:
        stderr.write('Unexpected space at the start of the program\n')
        exit(1)

debug = False

if __name__ == '__main__':
    main()