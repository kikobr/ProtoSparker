import commonjs from 'rollup-plugin-commonjs';
import coffee from 'rollup-plugin-coffee-script';
import nodeResolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
    input: 'src/ProtoSparker.coffee',
    output: {
        file: 'dist/ProtoSparker.js',
        format: 'iife',
        name: 'ProtoSparker'
    },
    watch: {
        include: 'src/**'
    },
    plugins: [
        coffee(),
        nodeResolve({
            browser: true,
            extensions: ['.js', '.coffee']
        }),
        commonjs({
            extensions: ['.js', '.coffee']
        }),
        serve({
            contentBase: ['demo', 'dist'],
            port: 8000,
        }),
        livereload({
            watch: ['dist', 'demo']
        })
    ]
}
