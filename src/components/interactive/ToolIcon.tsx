type ToolIconProps = {
  id: "chawan" | "chasen" | "chashaku";
};

export function ToolIcon({ id }: ToolIconProps) {
  switch (id) {
    case "chawan":
      return (
        <svg className="w-12 h-12 opacity-50" viewBox="120 80 474 320" fill="none" stroke="currentColor" strokeWidth="12">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          >
            <path
              id="bowl-outer-half"
              d="
                M 357 97
                C 300 96, 220 96, 177 98
                C 151 99, 137 104, 134 114
                C 130 158, 130 228, 137 279
                C 146 333, 195 356, 270 358
              "
            />
            <use href="#bowl-outer-half" transform="translate(714 0) scale(-1 1)" />
            <path
              id="bowl-foot-half"
              d="
                M 270 358
                C 278 372, 294 382, 314 385
                C 320 386, 326 386, 332 386
                L 357 386
              "
            />
            <use href="#bowl-foot-half" transform="translate(714 0) scale(-1 1)" />
          </g>
        </svg>
      );
    case "chasen":
      return (
        <svg className="w-12 h-12 opacity-50" viewBox="130 60 290 500" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          >
            <ellipse cx="274" cy="103" rx="130" ry="20" />
            <path d="M 144 104 C 155 165, 180 250, 218 355" />
            <path d="M 404 104 C 393 165, 368 250, 330 355" />
            <path d="M 218 355 C 246 366, 302 366, 330 355" />
            <path d="M 220 365 C 248 374, 300 374, 328 365" />
            <path d="M 220 365 C 216 376, 216 387, 222 398 L 222 536 C 222 545, 250 550, 274 550 C 298 550, 326 545, 326 536 L 326 398 C 332 387, 332 376, 328 365" />
            <path d="M 221 389 C 250 397, 298 397, 327 389" />
            <path d="M 221 407 C 250 414, 298 414, 327 407" />
            <path d="M 222 421 C 250 427, 298 427, 326 421" />
            <path d="M 274 118 C 262 160, 254 245, 256 340" />
            <path d="M 274 118 C 286 160, 294 245, 292 340" />
            <path d="M 256 340 C 264 348, 284 348, 292 340" />
            <path d="M 271 361 C 269 378, 266 392, 263 410" />
            <path d="M 278 361 C 280 378, 282 392, 285 410" />
            <path d="M 154 103 C 162 165, 181 250, 221 355" />
            <path d="M 166 97 C 172 164, 190 252, 225 355" />
            <path d="M 178 92 C 182 163, 198 254, 230 356" />
            <path d="M 190 89 C 193 162, 207 256, 235 357" />
            <path d="M 202 86 C 203 161, 216 258, 240 358" />
            <path d="M 214 84 C 214 160, 225 260, 246 359" />
            <path d="M 226 83 C 226 160, 235 262, 252 360" />
            <path d="M 238 82 C 237 160, 244 263, 258 361" />
            <path d="M 250 82 C 249 161, 254 264, 264 361" />
            <path d="M 262 82 C 261 162, 266 265, 270 362" />
            <path d="M 394 103 C 386 165, 367 250, 327 355" />
            <path d="M 382 97 C 376 164, 358 252, 323 355" />
            <path d="M 370 92 C 366 163, 350 254, 318 356" />
            <path d="M 358 89 C 355 162, 341 256, 313 357" />
            <path d="M 346 86 C 345 161, 332 258, 308 358" />
            <path d="M 334 84 C 334 160, 323 260, 302 359" />
            <path d="M 322 83 C 322 160, 313 262, 296 360" />
            <path d="M 310 82 C 311 160, 304 263, 290 361" />
            <path d="M 298 82 C 299 161, 294 264, 284 361" />
            <path d="M 286 82 C 287 162, 282 265, 278 362" />
            <path d="M 144 104 C 145 89, 158 87, 160 102" />
            <path d="M 166 97 C 167 83, 180 82, 181 96" />
            <path d="M 190 89 C 191 76, 203 76, 203 89" />
            <path d="M 214 84 C 215 72, 226 72, 226 83" />
            <path d="M 238 82 C 239 70, 250 70, 250 82" />
            <path d="M 262 82 C 263 70, 274 70, 274 82" />
            <path d="M 286 82 C 286 70, 297 70, 298 82" />
            <path d="M 310 82 C 310 70, 321 70, 322 83" />
            <path d="M 334 84 C 334 72, 345 72, 346 84" />
            <path d="M 358 89 C 358 76, 370 76, 370 89" />
            <path d="M 382 97 C 383 82, 396 83, 394 103" />
          </g>
        </svg>
      );
    case "chashaku":
      return (
        <svg className="w-12 h-12" viewBox="0 0 900 650" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            transform="translate(450, 325) rotate(-45) translate(-450, -325)"
          >
            
            <path
              d="
                M 112 96
                C 114 115, 119 135, 128 153
                C 136 169, 148 181, 165 189
                C 214 190, 312 186, 456 178
                C 475 176, 486 178, 501 180
                C 617 183, 746 190, 870 196
              "
            />

            
            <path
              d="
                M 116 98
                C 119 120, 126 143, 138 162
                C 146 175, 157 185, 176 192
                C 226 194, 326 188, 456 183
                C 475 182, 488 183, 502 185
                C 620 188, 748 193, 870 197
              "
            />

            
            <path
              d="
                M 112 96
                C 108 104, 111 119, 117 132
              "
            />

            
            <path
              d="
                M 180 190
                C 280 188, 370 183, 456 180
                C 474 179, 488 180, 503 182
              "
                opacity="0.55"
            />
          </g>
        </svg>
      );
  }
}
