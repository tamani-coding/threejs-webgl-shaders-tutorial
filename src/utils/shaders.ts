const layerStruct = `
    struct Layer {
        sampler2D colorMap;
        vec2 flowDirection;
        float flowSpeed;
        vec2 repeat;
    };
`;

const offsetUV = `
    vec2 offsetUV(vec2 uv, vec2 direction, float flowSpeed, vec2 repeat) {
        vec2 flowDirection = normalize(direction);
        return vec2( 
            uv.x * repeat.x - flowDirection.x * flowSpeed * time, 
            uv.y * repeat.y - flowDirection.y * flowSpeed * time
        );
    }
`;

export const vertexShader = `


    precision mediump float;
    precision mediump int;
    precision mediump int;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    varying vec2 vUv;

    void main()	{

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        vUv = uv;
    }

    
`;


export const fragmentShader = `
    precision mediump float;
    precision mediump int;

    `
    + layerStruct + 
    `

    uniform Layer textureLayer01;
    uniform Layer textureLayer02;
    uniform float time;

    varying vec2 vUv;

    `

    +  offsetUV +
    
    `

    void main()	{
        // UV with flow direction, speed and time
        vec2 flow01 = offsetUV(vUv, textureLayer01.flowDirection, textureLayer01.flowSpeed, textureLayer01.repeat);
        vec2 flow02 = offsetUV(vUv, textureLayer02.flowDirection, textureLayer02.flowSpeed, textureLayer02.repeat);

        // color maps
        vec4 layer01 = texture2D(textureLayer01.colorMap, flow01);
        vec4 layer02 = texture2D(textureLayer02.colorMap, flow02);

        // result fragment color
        gl_FragColor = layer01 + layer02;
    }
`;